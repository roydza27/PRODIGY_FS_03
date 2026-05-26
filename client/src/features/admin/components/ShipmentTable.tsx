"use client";

import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { GripVertical, Edit2, ShieldAlert, CheckCircle, Truck, Calendar } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import ShipmentStatusBadge from "./ShipmentStatusBadge";
import ConfirmDialog from "@/shared/components/confirm-dialog/ConfirmDialog";

import TableData from "@/shared/components/data-table/TableData";
import { TableFilters } from "@/shared/components/data-table/TableFilters";
import { RowDetailsOverlay } from "@/shared/components/data-table/RowDetailsOverlay";
import type { Shipment, ShipmentStatus } from "../services/shipment.service";

type Props = {
  shipments: Shipment[];
  onStatusChange: (shipmentId: string, status: ShipmentStatus) => void;
  onEditShipment?: (
    shipmentId: string,
    payload: {
      carrier: string;
      trackingNumber: string;
      eta: string;
      status: ShipmentStatus;
    }
  ) => Promise<void> | void;
  updatingShipmentId?: string | null;
};

type DraftShipment = {
  carrier: string;
  trackingNumber: string;
  eta: string;
  status: ShipmentStatus;
};

function isDeliveryReady(carrier: string, trackingNumber: string) {
  const carrierReady = carrier && carrier !== "Not Assigned" && carrier.trim() !== "";
  const trackingReady = trackingNumber && !trackingNumber.startsWith("TBD-") && trackingNumber.trim() !== "";
  return Boolean(carrierReady && trackingReady);
}

function DragHandle() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5">
      <GripVertical className="size-4" />
    </div>
  );
}

export default function ShipmentTable({
  shipments,
  onStatusChange,
  onEditShipment,
  updatingShipmentId,
}: Props) {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [draftEdit, setDraftEdit] = useState<DraftShipment>({
    carrier: "",
    trackingNumber: "",
    eta: "",
    status: "pending",
  });

  // TableFilters synchronization states
  const [search, setSearch] = useState("");
  const [carrierFilter, setCarrierFilter] = useState("all"); 
  const [statusFilter, setStatusFilter] = useState("all");

  const handleApplyFilters = () => {
    toast.info("Logistics tracking view updated");
  };

  // Upstream computed matrix matching local data arrays reactively
  const filteredShipments = useMemo(() => {
    const q = search.toLowerCase().trim();

    return shipments.filter((shipment) => {
      // 1. Text Query Search optimization
      const customerName = shipment.order?.shippingAddress?.fullName?.toLowerCase() ?? "";
      const customerEmail = shipment.order?.shippingAddress?.email?.toLowerCase() ?? "";
      const orderId = shipment.order?._id?.toLowerCase() ?? "";
      const shipmentId = shipment._id.toLowerCase();
      const trackingNumber = (shipment.trackingNumber || "").toLowerCase();
      const carrier = (shipment.carrier || "").toLowerCase();

      const matchesSearch =
        !q ||
        customerName.includes(q) ||
        customerEmail.includes(q) ||
        orderId.includes(q) ||
        shipmentId.includes(q) ||
        trackingNumber.includes(q) ||
        carrier.includes(q);

      // 2. Carrier Filter matching the dynamic 'department' dropdown slot position
      const matchesCarrierSelect =
        carrierFilter === "all" ||
        (shipment.carrier || "").toLowerCase() === carrierFilter.toLowerCase();

      // 3. Status tab synchronization loop
      const normalizedStatus = statusFilter === "on_leave" ? "in_transit" : statusFilter === "inactive" ? "cancelled" : statusFilter;
      const matchesStatus = statusFilter === "all" || shipment.status === normalizedStatus;

      return matchesSearch && matchesCarrierSelect && matchesStatus;
    });
  }, [shipments, search, carrierFilter, statusFilter]);

  const handleStartEdit = (shipment: Shipment) => {
    setDraftEdit({
      carrier: shipment.carrier || "",
      trackingNumber: shipment.trackingNumber || shipment._id.slice(-8).toUpperCase(),
      eta: shipment.eta || "",
      status: shipment.status,
    });
    setSelectedShipment(shipment);
  };

  const handleSaveChanges = async () => {
    if (!selectedShipment) return;
    
    if (!draftEdit.carrier.trim() || !draftEdit.trackingNumber.trim() || !draftEdit.eta.trim()) {
      return;
    }

    if (onEditShipment) {
      await onEditShipment(selectedShipment._id, {
        carrier: draftEdit.carrier.trim(),
        trackingNumber: draftEdit.trackingNumber.trim(),
        eta: draftEdit.eta.trim(),
        status: draftEdit.status,
      });
    } else {
      onStatusChange(selectedShipment._id, draftEdit.status);
    }
    setSelectedShipment(null);
  };

  const shipmentColumns = useMemo<ColumnDef<Shipment>[]>(() => [
    { id: "drag", header: () => null, cell: () => <DragHandle /> },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "_id",
      header: "Shipment",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="font-medium text-white">#{row.original._id.slice(-8).toUpperCase()}</p>
          <p className="text-xs text-zinc-500">
            {row.original.order ? `Order #${row.original.order._id.slice(-8).toUpperCase()}` : "Order unknown"}
          </p>
        </div>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="font-medium text-white">
            {row.original.order?.shippingAddress?.fullName || "Unknown Customer"}
          </p>
          <p className="text-xs text-zinc-500">
            {row.original.order?.items?.length || 0} item{(row.original.order?.items?.length || 0) !== 1 ? "s" : ""}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "carrier",
      header: "Carrier",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="text-sm text-zinc-300">{row.original.carrier || "Not Assigned"}</p>
          <p className="text-xs text-zinc-500 font-mono">
            {row.original.trackingNumber || `TBD-${row.original._id.slice(-8).toUpperCase()}`}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "eta",
      header: "ETA",
      cell: ({ row }) => <span className="text-sm text-zinc-300">{row.original.eta || "—"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <ShipmentStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleStartEdit(row.original)}
            className="rounded-xl border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 gap-1.5"
          >
            <Edit2 className="size-3.5" />
            Edit
          </Button>
        </div>
      ),
    },
  ], []);

  const isReadyForDelivery = isDeliveryReady(draftEdit.carrier, draftEdit.trackingNumber);

  return (
    <TableData
      data={filteredShipments}
      columns={shipmentColumns}
      selectedItem={selectedShipment}
      onSelectedItemChange={setSelectedShipment}
      /* INJECT MODULAR COMPONENT TOOLBAR WITHIN PROP SLOT */
      filterToolbar={
        <TableFilters
          search={search}
          setSearch={setSearch}
          department={carrierFilter}
          setDepartment={setCarrierFilter}
          status={statusFilter}
          setStatus={setStatusFilter}
          onApply={handleApplyFilters}
        />
      }
    >
      <RowDetailsOverlay
        title={selectedShipment ? `Manage Shipment #${selectedShipment._id.slice(-8).toUpperCase()}` : "Shipment Details"}
        description="Update operational carrier route parameters, ETA logs, and fulfillment tags."
        variant="drawer"
      >
        {selectedShipment && (
          <div className="space-y-6">
            
            {/* Carrier Logistics Configuration */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Truck className="size-3.5 text-[#DB4444]" /> Logistics Carrier Partner
              </label>
              <Input
                value={draftEdit.carrier}
                onChange={(e) => setDraftEdit(prev => ({ ...prev, carrier: e.target.value }))}
                placeholder="e.g., Delhivery, BlueDart, FedEx"
                className="h-11 border-white/10 bg-white/[0.02] text-white focus-visible:ring-[#DB4444]"
              />
            </div>

            {/* Tracking Reference Inputs */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Waybill / Tracking Number
              </label>
              <Input
                value={draftEdit.trackingNumber}
                onChange={(e) => setDraftEdit(prev => ({ ...prev, trackingNumber: e.target.value }))}
                placeholder="Enter unique airway bill reference"
                className="h-11 border-white/10 bg-white/[0.02] text-white focus-visible:ring-[#DB4444]"
              />
            </div>

            {/* Delivery Estimation Targets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Calendar className="size-3.5" /> Estimated Arrival (ETA)
              </label>
              <Input
                value={draftEdit.eta}
                onChange={(e) => setDraftEdit(prev => ({ ...prev, eta: e.target.value }))}
                placeholder="e.g., May 28, 2026, 5:00 PM"
                className="h-11 border-white/10 bg-white/[0.02] text-white focus-visible:ring-[#DB4444]"
              />
            </div>

            {/* Fulfillment Status Selection Dropdowns */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Fulfillment Status Tag
              </label>
<select
  value={draftEdit.status}
  onChange={(e) =>
    setDraftEdit((prev) => ({
      ...prev,
      status: e.target.value as ShipmentStatus,
    }))
  }
  className="h-11 w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-3 text-sm text-white outline-none focus:border-[#DB4444]"
>
  <option value="pending">Pending</option>
  <option value="packed">Packed</option>
  <option value="in_transit">In Transit</option>
  <option value="delivered">Delivered</option>
  <option value="cancelled">Cancelled</option>
</select>
            </div>

            {/* Form Validation Warning Notice Blocks */}
            {!isReadyForDelivery && draftEdit.status !== "cancelled" && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed">
                <ShieldAlert className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>Validation Constraints:</strong> You cannot mark a shipment as <em>Delivered</em> unless a valid logistics partner name and non-draft tracking number are assigned.
                </span>
              </div>
            )}

            {/* Staged Confirmation Trigger Trays */}
            <div className="pt-4 border-t border-white/5">
              <ConfirmDialog
                title="Save Logistics Record Update?"
                description={`This changes the operational parameters and sets shipment status directly to "${draftEdit.status.replace("_", " ")}".`}
                confirmLabel={updatingShipmentId === selectedShipment._id ? "Saving..." : "Commit Changes"}
                onConfirm={handleSaveChanges}
                trigger={
                  <Button
                    type="button"
                    disabled={updatingShipmentId === selectedShipment._id || !draftEdit.carrier.trim() || !draftEdit.trackingNumber.trim() || !draftEdit.eta.trim()}
                    className="w-full rounded-xl bg-[#DB4444] text-white hover:bg-[#c53a3a] h-11"
                  >
                    <CheckCircle className="size-4 mr-2" /> Save Shipment Parameters
                  </Button>
                }
              />
            </div>

          </div>
        )}
      </RowDetailsOverlay>
    </TableData>
  );
}