"use client";

import React, { useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { 
  AlertTriangle, 
  Edit2, 
  CheckCircle2, 
  GripVertical, 
  Eye, 
  Layers, 
  Hash, 
  Package, 
  TrendingDown 
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";

import TableData from "@/shared/components/data-table/TableData";
import { RowDetailsOverlay } from "@/shared/components/data-table/RowDetailsOverlay";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

const statusStyles: Record<InventoryItem["status"], string> = {
  "in-stock": "bg-green-600/20 text-green-200 border-green-600/30",
  "low-stock": "bg-yellow-600/20 text-yellow-200 border-yellow-600/30",
  "out-of-stock": "bg-red-600/20 text-red-200 border-red-600/30",
};

function DragHandle() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5">
      <GripVertical className="size-4" />
    </div>
  );
}

export default function SellerInventoryPage() {
  const [items] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Wireless Headphones",
      sku: "WH-001",
      category: "Electronics",
      currentStock: 15,
      reorderLevel: 10,
      status: "in-stock",
    },
    {
      id: "2",
      name: "USB-C Cable",
      sku: "USB-001",
      category: "Accessories",
      currentStock: 3,
      reorderLevel: 20,
      status: "low-stock",
    },
  ]);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const lowStockItems = useMemo(() => items.filter((i) => i.status !== "in-stock"), [items]);

  // 1. Dynamic TanStack Column Schema definitions local to inventory metrics
  const columns = useMemo<ColumnDef<InventoryItem>[]>(() => [
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
      header: "Product",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => setSelectedItem(row.original)}
          className="bg-transparent border-none p-0 text-left font-medium text-white hover:text-zinc-300 hover:underline cursor-pointer w-full block"
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => <span className="text-zinc-400 font-mono text-sm">{row.original.sku}</span>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span className="text-zinc-400 text-sm">{row.original.category}</span>,
    },
    {
      accessorKey: "currentStock",
      header: () => <div className="text-right w-full">Current Stock</div>,
      cell: ({ row }) => <div className="text-right font-semibold text-white font-mono">{row.original.currentStock}</div>,
    },
    {
      accessorKey: "reorderLevel",
      header: () => <div className="text-right w-full">Reorder Level</div>,
      cell: ({ row }) => <div className="text-right text-zinc-400 font-mono">{row.original.reorderLevel}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant="outline" className={`capitalize rounded-full px-2.5 py-0.5 ${statusStyles[status]}`}>
            {status === "in-stock" && <CheckCircle2 className="w-3 h-3 mr-1 shrink-0" />}
            {status !== "in-stock" && <AlertTriangle className="w-3 h-3 mr-1 shrink-0" />}
            {status.replace("-", " ")}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end pr-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedItem(row.original)}
            className="rounded-xl border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 h-8 gap-1"
          >
            <Edit2 className="size-3.5" />
            Manage
          </Button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="min-h-screen bg-[#09090B] text-white px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8 text-left">
        
        {/* Header Title Section */}
        <div className="mx-6">
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="mt-1 text-zinc-400">Track and manage store listings stock parameters.</p>
        </div>

        {/* Dynamic Presentation Pipeline Board wrapper */}
        <TableData
          data={items}
          columns={columns}
          selectedItem={selectedItem}
          onSelectedItemChange={setSelectedItem}
        >
          {/* Sliding details profile configuration layout */}
          <RowDetailsOverlay
            title={selectedItem?.name || "Inventory Assessment"}
            description={selectedItem ? `Item SKU Serial: ${selectedItem.sku}` : "Warehouse Allocation Ledger"}
            variant="drawer"
          >
            {selectedItem && (
              <div className="space-y-6">
                
                {/* Header Banner Status Wrap */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-400">
                    <Hash className="size-4" /> SKU: <span className="text-white font-sans font-bold">{selectedItem.sku}</span>
                  </div>
                  <Badge variant="outline" className={`capitalize rounded-full px-2.5 py-0.5 border-white/5 ${statusStyles[selectedItem.status]}`}>
                    {selectedItem.status.replace("-", " ")}
                  </Badge>
                </div>

                {/* Parametric Specification Info Grids */}
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                      <Package className="size-4 text-[#DB4444]" /> Current Stock Balance
                    </div>
                    <p className="text-2xl font-bold font-mono text-white">{selectedItem.currentStock} unit(s)</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                      <TrendingDown className="size-4" /> Reorder Level Limit
                    </div>
                    <p className="text-2xl font-bold font-mono text-zinc-300">{selectedItem.reorderLevel} units</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-2">
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                      <Layers className="size-4" /> Classification Category
                    </div>
                    <p className="text-sm font-semibold text-white capitalize">{selectedItem.category}</p>
                  </div>
                </div>

                {/* Stock Safety Condition Notice Text blocks */}
                {selectedItem.currentStock <= selectedItem.reorderLevel && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed">
                    <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                    <span>
                      <strong>Low Balance Trigger Alert:</strong> Current physical item availability count is lower or equivalent to the designated reorder margin parameters. Please process a replenishment supply invoice to avoid product depletion risks.
                    </span>
                  </div>
                )}

              </div>
            )}
          </RowDetailsOverlay>
        </TableData>

      </div>
    </div>
  );
}