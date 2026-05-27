"use client";

import { useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { 
  Calendar, 
  GripVertical, 
  IndianRupee, 
  Receipt, 
  ArrowUpRight 
} from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Tabs, TabsContent } from "@/shared/components/ui/tabs";

import TableData from "@/shared/components/data-table/TableData";
import { TableFilters } from "@/shared/components/data-table/TableFilters";
import { RowDetailsOverlay } from "@/shared/components/data-table/RowDetailsOverlay";

interface TransactionItem {
  id: string;
  referenceId: string;
  type: "sale" | "payout" | "refund";
  amount: number;
  status: "active" | "on_leave" | "inactive"; // Maps tags to Success (active), Pending (on_leave), Failed (inactive)
  date: string;
  description: string;
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  on_leave: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  inactive: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const statusLabels: Record<string, string> = {
  active: "Success",
  on_leave: "Pending",
  inactive: "Failed",
};

function DragHandle() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5">
      <GripVertical className="size-4" />
    </div>
  );
}

export default function SellerEarningsPage() {
  // Mock ledger collection tracking payout history and account adjustments
  const [mockLedger] = useState<TransactionItem[]>([
    { id: "tx_1", referenceId: "TXN-884910", type: "sale", amount: 4998, status: "active", date: "2026-05-24", description: "Fulfillment payload distribution sequence payout for Wireless Headphones entry" },
    { id: "tx_2", referenceId: "PAY-302941", type: "payout", amount: 25000, status: "active", date: "2026-05-20", description: "Automated nodal settlement cycle transfer to designated core bank register" },
    { id: "tx_3", referenceId: "TXN-104958", type: "sale", amount: 2495, status: "on_leave", date: "2026-05-25", description: "Pending balance tracking for USB-C Cable order fulfillment" },
    { id: "tx_4", referenceId: "REF-402911", type: "refund", amount: 1200, status: "inactive", date: "2026-05-18", description: "Customer return policy refund dispute adjustment log parameter failure" }
  ]);

  // Global toolbar status manager states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); 
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);

  const handleApplyFilters = () => {
    console.log("Committed accounting pipeline filter contexts:", { searchTerm, typeFilter, statusFilter });
  };

  // Multi-parameter ledger filter compute row array
  const filteredLedger = useMemo(() => {
    return mockLedger.filter((tx) => {
      const matchesSearch = !searchTerm || 
                            tx.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === "all" || tx.type === typeFilter;
      const matchesStatus = statusFilter === "all" || tx.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [mockLedger, searchTerm, typeFilter, statusFilter]);

  // TanStack column matrices explicitly formatting balance sheets
  const ledgerColumns = useMemo<ColumnDef<TransactionItem>[]>(() => [
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
    },
    {
      accessorKey: "referenceId",
      header: "Reference ID",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => setSelectedTx(row.original)}
          className="bg-transparent border-none p-0 cursor-pointer font-semibold font-mono text-white hover:text-zinc-300 hover:underline text-left"
        >
          {row.original.referenceId}
        </button>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className={`capitalize rounded-md px-2 py-0.5 text-xs font-normal tracking-wide ${row.original.type === 'payout' ? 'border-blue-500/20 bg-blue-500/5 text-blue-400' : 'border-zinc-800 bg-transparent text-zinc-300'}`}>
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const isExpense = row.original.type === 'payout' || row.original.type === 'refund';
        return (
          <span className={`font-medium text-sm font-mono ${isExpense ? 'text-zinc-300' : 'text-emerald-400'}`}>
            {isExpense ? "-" : "+"}₹{row.original.amount.toLocaleString()}
          </span>
        );
      }
    },
    {
      accessorKey: "date",
      header: "Settlement Date",
      cell: ({ row }) => <span className="text-zinc-400 text-sm font-mono">{row.original.date}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={`capitalize rounded-full px-2.5 py-0.5 font-normal text-[10px] tracking-wider ${statusStyles[row.original.status]}`}>
          {statusLabels[row.original.status]}
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
            onClick={() => setSelectedTx(row.original)}
            className="rounded-xl border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 gap-1"
          >
            <Receipt className="size-3.5" />
            Invoice
          </Button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="min-h-screen bg-[#111113] text-white px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="max-w-7xl space-y-8 text-left">
        
        {/* Header Metadata Title Row */}
        <div className="mx-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Earnings & Payouts</h1>
          <p className="mt-1 text-zinc-400">Track storefront settlements and configure payout target accounts.</p>
        </div>

        {/* Tab Filter Workspace Views */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsContent value="transactions" className="mt-0">
            {/* FIXED: Passed strict implicit context generic <TransactionItem> directly to table initialization */}
            <TableData<TransactionItem>
              data={filteredLedger}
              columns={ledgerColumns}
              selectedItem={selectedTx}
              onSelectedItemChange={setSelectedTx}
              filterToolbar={
                <TableFilters
                  search={searchTerm}
                  setSearch={setSearchTerm}
                  department={typeFilter}
                  setDepartment={setTypeFilter}
                  status={statusFilter}
                  setStatus={setStatusFilter}
                  onApply={handleApplyFilters}
                />
              }
            >
              {/* FIXED: Satisfied Controlled Component rule by feeding open and onOpenChange values cleanly */}
              <RowDetailsOverlay
                open={!!selectedTx}
                onOpenChange={(isOpen) => {
                  if (!isOpen) setSelectedTx(null);
                }}
                title={selectedTx ? `Transaction Audit ${selectedTx.referenceId}` : "Financial Overview"}
                description="Verify settlement logs, core platform margins, and status tags."
                variant="drawer"
              >
                {selectedTx && (
                  <div className="space-y-6">
                    
                    {/* Visual Media Header Row Summary */}
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                      <div className="h-12 w-12 rounded-xl bg-black/20 border border-white/10 flex items-center justify-center text-[#DB4444]">
                        <IndianRupee className="size-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-base font-semibold font-mono tracking-tight text-white">{selectedTx.referenceId}</h4>
                        <Badge className={`rounded-full border px-2 py-0.5 text-[9px] tracking-wider uppercase font-normal ${statusStyles[selectedTx.status]}`}>
                          {statusLabels[selectedTx.status]}
                        </Badge>
                      </div>
                    </div>

                    {/* Operational Value Cards Grids Layout */}
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                        <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                          <IndianRupee className="size-4 text-emerald-400" /> Transacted Balance
                        </div>
                        <p className="text-xl font-bold font-mono text-white">₹{selectedTx.amount.toLocaleString()}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                        <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                          <Calendar className="size-4 text-blue-400" /> Logged Timestamp
                        </div>
                        <p className="text-sm font-semibold text-zinc-300 font-mono">{selectedTx.date}</p>
                      </div>
                    </div>

                    {/* Ledger Descriptive Log Entry */}
                    <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">Auditing Account Log Context</p>
                      <p className="text-sm leading-relaxed text-zinc-300 font-medium">{selectedTx.description}</p>
                    </div>

                    {/* Transaction Utility Action Bar Options */}
                    <div className="pt-4 border-t border-white/5">
                      <Button className="w-full bg-[#DB4444] hover:bg-[#c53a3a] text-white rounded-xl h-11 transition-colors font-medium text-sm">
                        Download Digital Invoice Attachment <ArrowUpRight className="ml-1.5 size-4" />
                      </Button>
                    </div>

                  </div>
                )}
              </RowDetailsOverlay>
            </TableData>
          </TabsContent>

          <TabsContent value="payouts" className="mt-0">
            <Card className="border-white/10 bg-[#111113] p-8 rounded-2xl border-dashed flex flex-col items-center justify-center py-24 text-center">
              <Receipt className="size-10 text-zinc-700 mb-3" />
              <p className="text-base font-semibold text-white">No historical payouts scheduled</p>
              <p className="text-sm text-zinc-500 max-w-sm mt-1">Nodal balances will compile automatically at midnight during standard bank ledger reconciliation settlement periods.</p>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <Card className="border-white/10 bg-[#111113] p-8 rounded-2xl border-dashed flex flex-col items-center justify-center py-24 text-center">
              <Receipt className="size-10 text-zinc-700 mb-3" />
              <p className="text-base font-semibold text-white">Fulfillment Banking Node Active</p>
              <p className="text-sm text-zinc-500 max-w-sm mt-1">Settlements map matching your validated registration parameters. To re-verify KYC tax configurations or upgrade bank routing numbers, open an administrator support request ticket.</p>
            </Card>
          </TabsContent>
        </Tabs>
        
      </div>
    </div>
  );
}