"use client";

import React, { useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { 
  ArrowRight, 
  GripVertical, 
  ShoppingBag, 
  User, 
  Calendar, 
  Activity 
} from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Checkbox } from "@/shared/components/ui/checkbox";

import TableData from "@/shared/components/data-table/TableData";
import { TableFilters } from "@/shared/components/data-table/TableFilters";
import { RowDetailsOverlay } from "@/shared/components/data-table/RowDetailsOverlay";

interface Order {
  id: string; 
  orderId: string; 
  buyer: string; 
  product: string;
  quantity: number; 
  total: number; 
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

function DragHandle() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5">
      <GripVertical className="size-4" />
    </div>
  );
}

export default function SellerOrdersPage() {
  const [orders] = useState<Order[]>([
    { id: "1", orderId: "ORD-001", buyer: "John Doe", product: "Wireless Headphones", quantity: 2, total: 4998, status: "delivered", date: "2024-05-10" },
    { id: "2", orderId: "ORD-002", buyer: "Jane Smith", product: "USB-C Cable", quantity: 5, total: 2495, status: "shipped", date: "2024-05-12" },
  ]);

  // Synchronized state variables mapping to your global TableFilters hook props
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all"); // Catch-all department parameter slot
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "processing" | "shipped" | "delivered">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleApplyFilters = () => {
    console.log("Committed order workspace filters configuration values:", { searchTerm, departmentFilter, filterStatus });
  };

  // Upstream computed sorting array combining input parameters, tabs, and query text strings
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            o.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            o.product.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === "all" || o.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [orders, searchTerm, filterStatus]);

  // Dynamic TanStack column definitions local to order transactions
  const orderColumns = useMemo<ColumnDef<Order> []>(() => [
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
          onClick={() => setSelectedOrder(row.original)}
          className="bg-transparent border-none p-0 font-medium text-white hover:text-zinc-300 hover:underline cursor-pointer font-mono text-left"
        >
          {row.original.orderId}
        </button>
      ),
    },
    {
      accessorKey: "buyer",
      header: "Buyer",
      cell: ({ row }) => <span className="text-zinc-300 font-medium">{row.original.buyer}</span>,
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate space-y-0.5">
          <p className="text-zinc-300 truncate">{row.original.product}</p>
          <p className="text-xs text-zinc-500">Qty: {row.original.quantity}</p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className={`capitalize rounded-full px-2.5 py-0.5 border-white/5 ${statusColors[row.original.status]}`}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "total",
      header: () => <div className="text-right w-full pr-4">Total</div>,
      cell: ({ row }) => <div className="text-right font-semibold text-zinc-200 pr-2">₹{row.original.total.toLocaleString()}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedOrder(row.original)}
            className="text-[#DB4444] hover:text-[#c53a3a] hover:bg-white/5 rounded-xl gap-1"
          >
            Details <ArrowRight className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="min-h-screen bg-[#111113] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8 text-left">
        
        {/* Page Identity Title */}
        <div className="mx-6 flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-zinc-400">Oversee fulfillment and monitor customer transactions from a single matrix console view.</p>
        </div>

        {/* Dynamic Status Nav tabs counting parameters live */}

        {/* Unified Table Engine pipeline containing integrated search widgets */}
        <TableData
          data={filteredOrders}
          columns={orderColumns}
          selectedItem={selectedOrder}
          onSelectedItemChange={setSelectedOrder}
          /* INJECT UNIFIED FILTER ROW COMPONENT HERE */
          filterToolbar={
            <TableFilters
              search={searchTerm}
              setSearch={setSearchTerm}
              department={departmentFilter}
              setDepartment={setDepartmentFilter}
              status={filterStatus}
              setStatus={setFilterStatus as any}
              onApply={handleApplyFilters}
            />
          }
        >
          {/* Sliding Right Side Drawer Overlay Panel Component */}
          <RowDetailsOverlay
            title={selectedOrder ? `Fulfillment Ticket ${selectedOrder.orderId}` : "Order Profile Overview"}
            description="Inspect merchant basket itemization ledger and transactional records."
            variant="drawer"
          >
            {selectedOrder && (
              <div className="space-y-6">
                
                {/* Visual Header Summary State Tag */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-400">
                    <Calendar className="size-4" /> Logged Date: <span className="text-white font-sans font-medium">{selectedOrder.date}</span>
                  </div>
                  <Badge variant="outline" className={`capitalize rounded-full px-2.5 py-0.5 border-white/5 ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </Badge>
                </div>

                {/* Main Purchase Line Item Breakdown Summary Card */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <ShoppingBag className="size-4 text-[#DB4444]" /> Order Item Content
                  </p>
                  
                  <div className="flex items-center justify-between bg-black/10 p-3 rounded-xl border border-white/5">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-white">{selectedOrder.product}</p>
                      <p className="text-xs text-zinc-500">Quantity Purchased: {selectedOrder.quantity} unit(s)</p>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 flex items-center justify-between text-sm font-bold text-white">
                    <span>Total Transaction Value</span>
                    <span className="text-lg text-[#DB4444]">₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Customer Account Identity Profile Parameters */}
                <div className="grid gap-3 grid-cols-1">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                      <User className="size-4" /> Customer Account Name
                    </div>
                    <p className="text-sm font-semibold text-[#FAFAFA]">{selectedOrder.buyer}</p>
                  </div>
                </div>

                {/* Informational Warehouse Safety Instructions Box */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#A1A1AA] flex items-center gap-1.5">
                    <Activity className="size-3.5" /> Logistics Workflow Note
                  </p>
                  <p className="text-xs leading-relaxed text-zinc-400">
                    Verify item availability in the warehouse before moving order states to shipped. Airway bill logs will populate matching your regional carrier partner assignments.
                  </p>
                </div>

              </div>
            )}
          </RowDetailsOverlay>
        </TableData>
        
      </div>
    </div>
  );
}