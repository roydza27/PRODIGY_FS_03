"use client";

import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { GripVertical, Eye, Mail, ShoppingBag, Wallet, Calendar } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { formatPrice } from "@/features/products/utils/product.helpers";

import TableData from "@/shared/components/data-table/TableData";
import { RowDetailsOverlay } from "@/shared/components/data-table/RowDetailsOverlay";
import { TableFilters } from "@/shared/components/data-table/TableFilters"; // Fixed duplicate named import path
import type { AdminCustomer } from "../services/customer.service";

type Props = {
  customers: AdminCustomer[];
  onView?: (customer: AdminCustomer) => void;
};

const statusStyles: Record<string, string> = {
  vip: "border-emerald-500/20 bg-emerald-500/15 text-emerald-400",
  active: "border-blue-500/20 bg-blue-500/15 text-blue-400",
  regular: "border-zinc-500/20 bg-zinc-500/15 text-zinc-300",
};

function DragHandle() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5">
      <GripVertical className="size-4" />
    </div>
  );
}

export default function CustomerTable({ customers, onView }: Props) {
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  // Core filter states required by the <TableFilters /> component layer
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");

  const handleApplyFilters = () => {
    console.log("Committed tool filters state values:", { search, department, status });
  };

  const handleOpenDetails = (customer: AdminCustomer) => {
    setSelectedCustomer(customer);
    if (onView) onView(customer);
  };

  // Dynamic TanStack Column Schema definitions local to customer context profiles
  const columns = useMemo<ColumnDef<AdminCustomer> []>(() => [
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
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => handleOpenDetails(row.original)}
          className="flex flex-col text-left bg-transparent border-none p-0 cursor-pointer w-full group"
        >
          <span className="font-medium text-white group-hover:text-zinc-300 group-hover:underline">
            {row.original.name}
          </span>
          <span className="text-xs text-zinc-500">{row.original.email}</span>
        </button>
      ),
    },
    {
      accessorKey: "orders",
      header: "Orders",
      cell: ({ row }) => <span className="text-sm text-zinc-300 font-mono">{row.original.orders}</span>,
    },
    {
      accessorKey: "totalSpent",
      header: "Total Spent",
      cell: ({ row }) => <span className="text-sm text-zinc-300 font-medium">{formatPrice(row.original.totalSpent)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={`rounded-full border px-2 py-0.5 font-normal uppercase text-[10px] tracking-wider ${statusStyles[row.original.status] || "border-white/10 text-white"}`}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end pr-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleOpenDetails(row.original)}
            className="rounded-xl border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 gap-1.5"
          >
            <Eye className="size-3.5" />
            View Profile
          </Button>
        </div>
      ),
    },
  ], [onView]);

  // Client-side execution loop matching state selections back down into table rows
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchesSearch = !search || 
        cust.name.toLowerCase().includes(search.toLowerCase()) || 
        cust.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = status === "all" || cust.status === status;
      
      // If customer models don't hold structural branch properties, return search + status constraints
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, status]);

  return (
    <TableData
      data={filteredCustomers}
      columns={columns}
      selectedItem={selectedCustomer}
      onSelectedItemChange={setSelectedCustomer}
      filterToolbar={
        <TableFilters
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          status={status}
          setStatus={setStatus}
          onApply={handleApplyFilters}
        />
      }
    >
      <RowDetailsOverlay
        title={selectedCustomer?.name || "Customer Profile Record"}
        description="Review transactional metrics, account loyalty status, and communication channels."
        variant="drawer"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            
            {/* Top Profile Card Summary Row */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <div className="h-12 w-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-bold text-white text-sm">
                {selectedCustomer.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-semibold tracking-tight text-white leading-tight">{selectedCustomer.name}</h4>
                <Badge className={`rounded-full border px-2 py-0.5 font-normal uppercase text-[9px] tracking-wider ${statusStyles[selectedCustomer.status] || "border-white/10 text-white"}`}>
                  {selectedCustomer.status} Account
                </Badge>
              </div>
            </div>

            {/* Loyalty Matrix Parameters Grid Layout */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                  <Mail className="size-4" /> Primary Email
                </div>
                <p className="break-words text-sm font-medium text-[#FAFAFA]">{selectedCustomer.email}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                  <Wallet className="size-4" /> Lifetime Purchase Value
                </div>
                <p className="text-lg font-bold text-emerald-400">{formatPrice(selectedCustomer.totalSpent)}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                  <ShoppingBag className="size-4" /> Total Completed Orders
                </div>
                <p className="text-sm font-semibold text-white">{selectedCustomer.orders} processed transaction(s)</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                  <Calendar className="size-4" /> Account Type
                </div>
                <span className="text-sm font-semibold capitalize text-zinc-300">{selectedCustomer.status} Class</span>
              </div>
            </div>

            {/* Quick Context Activity Log Segment */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">Loyalty Analysis</p>
              <p className="text-sm leading-relaxed text-zinc-400">
                {selectedCustomer.status === "vip" 
                  ? "This user is flagged as a high-tier shopper. Prioritize customer support tickets and dispatch exclusive promotional campaign benefits."
                  : "Standard transactional user account. Core log entries show stable payment authorization metrics across previous purchases."}
              </p>
            </div>

          </div>
        )}
      </RowDetailsOverlay>
    </TableData>
  );
}