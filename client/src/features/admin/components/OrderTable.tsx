import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { 
  GripVertical, 
  Eye, 
  ShoppingBag, 
  User, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle2 
} from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { formatPrice } from "@/features/products/utils/product.helpers";
import OrderStatusBadge, { type AdminOrderStatus } from "./OrderStatusBadge";

import TableData from "@/shared/components/data-table/TableData";
import { RowDetailsOverlay } from "@/shared/components/data-table/RowDetailsOverlay";

// Export type contexts matching your original setups
export interface AdminOrderItemSnapshot {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface AdminShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AdminShipmentSnapshot {
  _id: string;
  carrier: string;
  trackingNumber: string;
  status: string;
  eta: string;
}

export interface AdminOrder {
  _id: string;
  items: AdminOrderItemSnapshot[];
  shippingAddress: AdminShippingAddress;
  paymentMethod: "cod" | "card";
  status: AdminOrderStatus;
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  shipment?: AdminShipmentSnapshot;
}

type Props = {
  orders: AdminOrder[];
  onStatusChange: (orderId: string, status: AdminOrderStatus) => void;
  updatingOrderId?: string | null;
};

function DragHandle() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5">
      <GripVertical className="size-4" />
    </div>
  );
}

export default function OrderTable({
  orders,
  onStatusChange,
  updatingOrderId,
}: Props) {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [localStatus, setLocalStatus] = useState<AdminOrderStatus>("pending");

  // Open overlay tray state configuration 
  const handleOpenReview = (order: AdminOrder) => {
    setLocalStatus(order.status);
    setSelectedOrder(order);
  };

  const handleStatusCommit = async () => {
    if (!selectedOrder) return;
    await onStatusChange(selectedOrder._id, localStatus);
    setSelectedOrder(null);
  };

  // Define data table schema dynamically via useMemo
  const orderColumns = useMemo<ColumnDef<AdminOrder>[]>(() => [
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
      header: "Order",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => handleOpenReview(row.original)}
          className="bg-transparent border-none p-0 cursor-pointer text-left space-y-0.5 group"
        >
          <p className="font-medium text-white group-hover:text-zinc-300 group-hover:underline">
            #{row.original._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-zinc-500">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </p>
        </button>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="font-medium text-white">{row.original.shippingAddress.fullName}</p>
          <p className="text-xs text-zinc-500">{row.original.shippingAddress.email}</p>
        </div>
      ),
    },
    {
      id: "itemsCount",
      header: "Items",
      cell: ({ row }) => (
        <span className="text-sm text-zinc-300">
          {row.original.items.length} item{row.original.items.length > 1 ? "s" : ""}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => <span className="text-sm font-medium text-zinc-300">{formatPrice(row.original.total)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleOpenReview(row.original)}
            className="rounded-xl border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 gap-1.5"
          >
            <Eye className="size-3.5" />
            Review Order
          </Button>
        </div>
      ),
    },
  ], []);

  const isFinalized = selectedOrder?.status === "delivered" || selectedOrder?.status === "cancelled";

  return (
    <TableData
      data={orders}
      columns={orderColumns}
      selectedItem={selectedOrder}
      onSelectedItemChange={setSelectedOrder}
    >
      <RowDetailsOverlay
        title={selectedOrder ? `Fulfillment Audit #${selectedOrder._id.slice(-8).toUpperCase()}` : "Order Details"}
        description="Verify billing method records, item catalogs, and modify state parameters."
        variant="drawer"
      >
        {selectedOrder && (
          <div className="space-y-6">
            
            {/* Top Status Banner Summary */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-zinc-400" />
                <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                  Payment: <span className="text-white font-sans font-bold uppercase">{selectedOrder.paymentMethod}</span>
                </span>
              </div>
              <OrderStatusBadge status={selectedOrder.status} />
            </div>

            {/* Customer Information Cards */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <User className="size-4 text-[#DB4444]" /> Shipping Address Context
              </p>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-white">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-xs text-zinc-400">{selectedOrder.shippingAddress.email} • {selectedOrder.shippingAddress.phone}</p>
                <p className="text-zinc-300 leading-relaxed pt-1 flex items-start gap-1">
                  <MapPin className="size-3.5 shrink-0 text-zinc-500 mt-0.5" />
                  <span>
                    {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode},{" "}
                    {selectedOrder.shippingAddress.country}
                  </span>
                </p>
              </div>
            </div>

            {/* Order Items Snapshots Mapping List */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <ShoppingBag className="size-4 text-[#DB4444]" /> Line Items Basket ({selectedOrder.items.length})
              </p>
              <div className="divide-y divide-white/5 max-h-48 overflow-y-auto pr-1 space-y-2.5">
                {selectedOrder.items.map((item, idx) => (
                  <div key={item.productId + idx} className="flex items-center justify-between pt-2.5 first:pt-0">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-black/20 border border-white/5 overflow-hidden shrink-0">
                        <img src={item.image || "/placeholder-product.png"} alt={item.name} className="size-full object-contain p-1" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white line-clamp-1 max-w-[220px]">{item.name}</p>
                        <p className="text-xs text-zinc-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-zinc-300">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-sm font-bold text-white">
                <span>Grand Total</span>
                <span className="text-lg text-[#DB4444]">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Shipment Telemetry Tracking Data (If logged) */}
            {selectedOrder.shipment && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Truck className="size-4 text-zinc-400" /> Logistics Snapshot
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs font-medium text-zinc-300">
                  <div><span className="text-zinc-500 block">Carrier Partner</span>{selectedOrder.shipment.carrier}</div>
                  <div><span className="text-zinc-500 block">Tracking Waybill</span><span className="font-mono">{selectedOrder.shipment.trackingNumber}</span></div>
                  <div><span className="text-zinc-500 block">Fulfillment Status</span><span className="capitalize">{selectedOrder.shipment.status}</span></div>
                  <div><span className="text-zinc-500 block">Logistics ETA</span>{selectedOrder.shipment.eta || "—"}</div>
                </div>
              </div>
            )}

            {/* State Management Configuration Processing Trays */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <label className="text-xs uppercase tracking-wide font-semibold text-zinc-400 block">
                Modify Fulfillment Pipeline Status
              </label>
              
              <div className="flex flex-col gap-3">
                <select
                  value={localStatus}
                  onChange={(e) => setLocalStatus(e.target.value as AdminOrderStatus)}
                  disabled={isFinalized}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-3 text-sm text-white outline-none focus:border-[#DB4444] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  {selectedOrder.status === "delivered" && <option value="delivered">Delivered</option>}
                  {selectedOrder.status === "cancelled" && <option value="cancelled">Cancelled</option>}
                </select>

                {!isFinalized ? (
                  <Button
                    type="button"
                    disabled={updatingOrderId === selectedOrder._id}
                    onClick={handleStatusCommit}
                    className="w-full h-11 bg-[#DB4444] hover:bg-[#c53a3a] text-white rounded-xl transition-colors"
                  >
                    <CheckCircle2 className="size-4 mr-2" />
                    {updatingOrderId === selectedOrder._id ? "Updating state parameter logs..." : "Commit Status Change"}
                  </Button>
                ) : (
                  <div className="p-3.5 bg-zinc-900/40 border border-white/5 rounded-xl text-xs text-zinc-400 text-center">
                    This transaction registry instance is closed out as <strong className="capitalize text-zinc-300">{selectedOrder.status}</strong> and cannot be systematically modified further.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </RowDetailsOverlay>
    </TableData>
  );
}