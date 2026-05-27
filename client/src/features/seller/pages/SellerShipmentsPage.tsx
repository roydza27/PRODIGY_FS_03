"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  Copy,
  ShoppingBag,
  Truck,
  Package,
  Clock3,
  Route,
  ClipboardList,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent } from "@/shared/components/ui/tabs";
import { Checkbox } from "@/shared/components/ui/checkbox";

import TableData from "@/shared/components/data-table/TableData";
import { TableFilters } from "@/shared/components/data-table/TableFilters";
import { RowDetailsOverlay } from "@/shared/components/data-table/RowDetailsOverlay";

interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: "pending" | "shipped" | "in-transit" | "delivered";
  date: string;
  items: string;
}

const initialShipments: Shipment[] = [
  { id: "1", orderId: "ORD-001", trackingNumber: "TRK123456789", carrier: "DHL", status: "delivered", date: "2024-05-10", items: "Wireless Headphones x2" },
  { id: "2", orderId: "ORD-002", trackingNumber: "TRK987654321", carrier: "FedEx", status: "in-transit", date: "2024-05-12", items: "USB-C Cable x5" },
  { id: "3", orderId: "ORD-003", trackingNumber: "TRK555222111", carrier: "UPS", status: "shipped", date: "2024-05-13", items: "Phone Case x3" },
  { id: "4", orderId: "ORD-004", trackingNumber: "TRK111333777", carrier: "Blue Dart", status: "pending", date: "2024-05-14", items: "Bluetooth Speaker x1" },
];

const statusMeta: Record<Shipment["status"], { label: string; classes: string; icon: React.ElementType }> = {
  pending: { label: "Pending", classes: "border-amber-500/20 bg-amber-500/10 text-amber-300", icon: Clock3 },
  shipped: { label: "Shipped", classes: "border-blue-500/20 bg-blue-500/10 text-blue-300", icon: Package },
  "in-transit": { label: "In Transit", classes: "border-violet-500/20 bg-violet-500/10 text-violet-300", icon: Route },
  delivered: { label: "Delivered", classes: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300", icon: CheckCircle2 },
};

function getProgress(status: Shipment["status"]) {
  switch (status) {
    case "pending": return 20;
    case "shipped": return 45;
    case "in-transit": return 75;
    case "delivered": return 100;
  }
}

function progressTone(status: Shipment["status"]) {
  switch (status) {
    case "pending": return "bg-amber-500";
    case "shipped": return "bg-blue-500";
    case "in-transit": return "bg-violet-500";
    case "delivered": return "bg-emerald-500";
  }
}

function DragHandle() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5">
      <GripVertical className="size-4" />
    </div>
  );
}

export default function SellerShipmentsPage() {
  // Synchronized search and option filters local states
  const [searchTerm, setSearchTerm] = useState("");
  const [carrierFilter, setCarrierFilter] = useState("all"); 
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const handleApplyFilters = () => {
    toast.info("Logistics tracking filters refreshed");
  };

  // Upstream computed filter engine coordinating inputs, tabs, and select pickers
  const filteredShipments = useMemo(() => {
    return initialShipments.filter((shipment) => {
      const matchesSearch = !searchTerm || 
                            shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            shipment.items.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCarrier = carrierFilter === "all" || 
                             shipment.carrier.toLowerCase() === carrierFilter.toLowerCase();
                             
      // Normalize layout status maps back into active status configs cleanly
      const normalizedTabStatus = activeTab === "on_leave" ? "in-transit" : activeTab === "inactive" ? "pending" : activeTab;
      const matchesTab = activeTab === "all" || shipment.status === normalizedTabStatus;

      return matchesSearch && matchesCarrier && matchesTab;
    });
  }, [searchTerm, carrierFilter, activeTab]);

  const handleCopyTracking = async (tracking: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(tracking);
      toast.success("Tracking reference copied successfully");
    } catch {
      toast.error("Unable to copy route tracking number");
    }
  };

  // Structural TanStack table column mapping matrices definitions
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
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => setSelectedShipment(row.original)}
          className="bg-transparent border-none p-0 cursor-pointer font-semibold text-white hover:text-zinc-300 hover:underline text-left font-mono"
        >
          {row.original.orderId}
        </button>
      ),
    },
    {
      accessorKey: "carrier",
      header: "Logistics",
      cell: ({ row }) => (
        <div className="space-y-0.5 text-sm text-zinc-300">
          <p className="font-medium text-white">{row.original.carrier}</p>
          <button 
            type="button" 
            onClick={(e) => handleCopyTracking(row.original.trackingNumber, e)}
            className="text-xs text-zinc-500 font-mono hover:text-zinc-300 flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
          >
            {row.original.trackingNumber} <Copy className="size-3" />
          </button>
        </div>
      ),
    },
    {
      accessorKey: "items",
      header: "Items In Transit",
      cell: ({ row }) => <span className="text-sm text-zinc-400 font-medium line-clamp-1 max-w-[200px]">{row.original.items}</span>,
    },
    {
      accessorKey: "date",
      header: "Dispatched Date",
      cell: ({ row }) => <span className="text-sm text-zinc-400 font-mono">{row.original.date}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const meta = statusMeta[row.original.status];
        const Icon = meta.icon;
        return (
          <Badge variant="outline" className={`capitalize rounded-full px-2.5 py-0.5 border-white/5 font-normal tracking-wide ${meta.classes}`}>
            <Icon className="w-3 h-3 mr-1 shrink-0" /> {meta.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end pr-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSelectedShipment(row.original)}
            className="rounded-xl border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 gap-1.5"
          >
            <Truck className="size-3.5" />
            Track
          </Button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="min-h-screen bg-[#111113] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8 text-left">
        
        {/* Top Profile Summary Title Row */}
        <div className="mx-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shipments</h1>
            <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
              Manage order shipment flow, track carrier updates, and monitor delivery performance from a single operations view.
            </p>
          </div>
        </div>

        {/* Workspace Operations View Layout Pipeline boards */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value={activeTab} className="mt-0">
            {/* FIXED: Passed strict implicit context generic <Shipment> directly to table invocation */}
            <TableData<Shipment>
              data={filteredShipments}
              columns={shipmentColumns}
              selectedItem={selectedShipment}
              onSelectedItemChange={setSelectedShipment}
              filterToolbar={
                <TableFilters
                  search={searchTerm}
                  setSearch={setSearchTerm}
                  department={carrierFilter}
                  setDepartment={setCarrierFilter}
                  status={activeTab}
                  setStatus={setActiveTab}
                  onApply={handleApplyFilters}
                />
              }
            >
              {/* FIXED: Satisfied controlled state paradigm specifications by binding explicit open/change props */}
              <RowDetailsOverlay
                open={!!selectedShipment}
                onOpenChange={(isOpen) => {
                  if (!isOpen) setSelectedShipment(null);
                }}
                title={selectedShipment ? `Track Package ${selectedShipment.orderId}` : "Logistical Analysis"}
                description="Monitor telemetry milestones and copy transit reference indices."
                variant="drawer"
              >
                {selectedShipment && (
                  <div className="space-y-6">
                    
                    {/* Telemetry Tracking Metrics Condition Bars */}
                    <div className="space-y-2 bg-black/20 p-4 border border-white/5 rounded-2xl">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span className="font-medium">Fulfillment Pathway Progress</span>
                        <span className="font-mono font-bold text-white">{getProgress(selectedShipment.status)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressTone(selectedShipment.status)}`}
                          style={{ width: `${getProgress(selectedShipment.status)}%` }}
                        />
                      </div>
                    </div>

                    {/* Parametric Info Blocks Cards Grid */}
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                        <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                          <Truck className="size-4 text-[#DB4444]" /> Logistics Partner
                        </div>
                        <p className="text-sm font-semibold text-white">{selectedShipment.carrier}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                        <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                          <ClipboardList className="size-4" /> Dispatched On
                        </div>
                        <p className="text-sm font-semibold text-white font-mono">{selectedShipment.date}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/3 p-4 sm:col-span-2">
                        <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                          <ShoppingBag className="size-4" /> Container Pack Manifest
                        </div>
                        <p className="text-sm font-semibold text-white leading-relaxed">{selectedShipment.items}</p>
                      </div>
                    </div>

                    {/* Airway Bill Actions Input Cards */}
                    <div className="rounded-2xl border border-white/10 bg-white/3 p-4 space-y-3">
                      <span className="text-xs uppercase tracking-wide font-medium text-[#A1A1AA] block">Waybill References</span>
                      <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 font-mono text-xs">
                        <span className="text-zinc-300 select-all">{selectedShipment.trackingNumber}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-7 text-zinc-400 hover:text-white hover:bg-white/5"
                          onClick={() => handleCopyTracking(selectedShipment.trackingNumber)}
                        >
                          <Copy className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Interactive Action Redirect Trays */}
                    <div className="pt-4 border-t border-white/5">
                      <Button className="w-full bg-[#DB4444] hover:bg-[#c53a3a] text-white h-11 rounded-xl transition-all font-medium flex items-center justify-center gap-2">
                        Launch Third-Party Courier API Tracking <Package className="size-4" />
                      </Button>
                    </div>

                  </div>
                )}
              </RowDetailsOverlay>
            </TableData>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}