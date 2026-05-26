"use client";

import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { GripVertical, Edit3, Trash2, Box, Layers, Tag, Eye } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import TableData from "@/shared/components/data-table/TableData";
import { RowDetailsOverlay } from "@/shared/components/data-table/RowDetailsOverlay";
import { TableFilters } from "@/shared/components/data-table/TableFilters";
import ConfirmDialog from "@/shared/components/confirm-dialog/ConfirmDialog";
import type { Product } from "@/features/products/types/product.types";

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  draft: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  archived: "bg-zinc-500/15 text-zinc-300 border-zinc-500/20",
};

function getStockLabel(stock?: number) {
  if (!stock || stock <= 0) return "Out of stock";
  if (stock <= 5) return "Low stock";
  return "In stock";
}

function getStockBadgeClass(stock?: number) {
  if (!stock || stock <= 0) return "text-red-400";
  if (stock <= 5) return "text-amber-400";
  return "text-zinc-500";
}

function DragHandle() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5">
      <GripVertical className="size-4" />
    </div>
  );
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // States synchronized with your global filter toolbar fields
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all"); 
  const [status, setStatus] = useState("all");

  const handleApplyFilters = () => {
    console.log("Committed search filtering variables:", { search, department, status });
  };

  // Dynamic Column Definitions utilizing TanStack ColumnDef configurations
  const columns = useMemo<ColumnDef<Product>[]>(() => [
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
          onClick={() => setSelectedProduct(row.original)}
          className="flex items-center gap-3 text-left bg-transparent border-none p-0 cursor-pointer w-full group select-text"
        >
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-black/20 border border-white/10">
            <img 
              src={row.original.images?.[0] || "/placeholder-product.png"} 
              alt={row.original.name} 
              className="h-full w-full object-contain p-1" 
            />
          </div>
          <div>
            <p className="font-medium text-white group-hover:text-zinc-300 group-hover:underline">{row.original.name}</p>
            <p className="text-xs text-zinc-500 line-clamp-1 max-w-[200px]">{row.original.description}</p>
          </div>
        </button>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span className="text-zinc-300 text-sm capitalize">{row.original.category || "—"}</span>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span className="text-zinc-300 text-sm font-medium font-mono">₹{row.original.price?.toLocaleString()}</span>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm text-zinc-300 font-mono">{row.original.stock ?? 0}</span>
          <span className={`text-[10px] font-medium ${getStockBadgeClass(row.original.stock)}`}>
            {getStockLabel(row.original.stock)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const productStatus = row.original.status || "unknown";
        return (
          <Badge className={`rounded-full border px-2 py-0.5 font-normal uppercase text-[10px] tracking-wider ${statusStyles[productStatus] || "border-white/10 bg-transparent text-white"}`}>
            {productStatus}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2 pr-1">
          <Button
            type="button"
            onClick={() => onEdit(row.original)}
            variant="ghost"
            size="sm"
            className="rounded-xl border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 h-8 gap-1"
          >
            <Edit3 className="size-3.5" />
            Edit
          </Button>
          
          <ConfirmDialog
            title="Delete this product entry?"
            description={`Are you sure you want to permanently remove "${row.original.name}" from the system product registry? This cannot be undone.`}
            confirmLabel="Delete Asset"
            onConfirm={() => onDelete(row.original)}
            trigger={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-xl border border-white/5 text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8"
              >
                <Trash2 className="size-3.5" />
              </Button>
            }
          />
        </div>
      ),
    },
  ], [onEdit, onDelete]);

  // Processes state filters dynamically before passing down to TableData display array
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = !search || 
        product.name.toLowerCase().includes(search.toLowerCase()) || 
        (product.brand || "").toLowerCase().includes(search.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = department === "all" || 
        (product.category || "").toLowerCase() === department.toLowerCase();
      
      const matchesStatus = status === "all" || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, department, status]);

  return (
    <TableData
      data={filteredProducts}
      columns={columns}
      selectedItem={selectedProduct}
      onSelectedItemChange={setSelectedProduct}
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
        title={selectedProduct?.name || "Product Catalog Details"}
        description={selectedProduct?.brand ? `Brand Reference: ${selectedProduct.brand}` : "Logistical Inventory Spec Sheet"}
        variant="drawer"
      >
        {selectedProduct && (
          <div className="space-y-6">
            
            {/* Visual Media Header Banner Summary */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center">
                <img 
                  src={selectedProduct.images?.[0] || "/placeholder-product.png"} 
                  alt={selectedProduct.name} 
                  className="h-full w-full object-contain p-1" 
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-semibold tracking-tight text-white leading-tight">{selectedProduct.name}</h4>
                <Badge className={`rounded-full border px-2 py-0.5 font-normal uppercase text-[9px] tracking-wider ${statusStyles[selectedProduct.status || ""] || "border-white/10 text-white"}`}>
                  {selectedProduct.status || "unknown"}
                </Badge>
              </div>
            </div>

            {/* Informational Parameter Information Cards Grid */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                  <Tag className="size-4" /> Retail Price Value
                </div>
                <p className="text-lg font-bold text-white font-mono">₹{selectedProduct.price?.toLocaleString()}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                  <Box className="size-4" /> Real-time Warehouse Stock
                </div>
                <p className="text-sm font-semibold text-white">
                  {selectedProduct.stock ?? 0} units ({getStockLabel(selectedProduct.stock)})
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                  <Layers className="size-4" /> Storefront Category
                </div>
                <p className="text-sm font-semibold capitalize text-white">{selectedProduct.category || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                  <Eye className="size-4" /> Item Brand Identifier
                </div>
                <p className="text-sm font-semibold text-white">{selectedProduct.brand || "—"}</p>
              </div>
            </div>

            {/* Markdown Description Detail Content Block */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">Catalog Item Summary</p>
              <p className="text-sm leading-relaxed text-zinc-300">
                {selectedProduct.description || "No specific detailed descriptions registered for this catalog item asset."}
              </p>
            </div>

            {/* Drawer Control Options Footer Area Container */}
            <div className="pt-4 border-t border-white/5 flex gap-3">
              <Button
                type="button"
                className="flex-1 bg-white/10 text-white hover:bg-white/15 border border-white/10 rounded-xl font-medium"
                onClick={() => {
                  onEdit(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                Launch Product Editor
              </Button>
            </div>

          </div>
        )}
      </RowDetailsOverlay>
    </TableData>
  );
}