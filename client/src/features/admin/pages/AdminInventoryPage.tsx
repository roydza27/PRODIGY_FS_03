"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";

import AdminPageShell from "../components/AdminPageShell";
import TableData from "@/shared/components/data-table/TableData";
import { TableFilters } from "@/shared/components/data-table/TableFilters";
import { RowDetailsOverlay } from "@/shared/components/data-table/RowDetailsOverlay";

import { adminProductService } from "../services/product.service";
import type { Product } from "@/features/products/types/product.types";
import {
  AlertTriangle,
  BarChart3,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Warehouse,
  GripVertical,
  Package,
  Layers,
  Tags,
  Eye,
} from "lucide-react";

const CATEGORY_OPTIONS = [
  "all",
  "electronics",
  "fashion",
  "home",
  "groceries",
  "beauty",
  "sports",
  "toys",
  "books",
  "other",
] as const;

type CategoryFilter = (typeof CATEGORY_OPTIONS)[number];

const statusStyles: Record<string, string> = {
  active: "border-emerald-500/20 bg-emerald-500/15 text-emerald-400",
  draft: "border-amber-500/20 bg-amber-500/15 text-amber-400",
  archived: "border-zinc-500/20 bg-zinc-500/15 text-zinc-300",
};

function DragHandle() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5">
      <GripVertical className="size-4" />
    </div>
  );
}

function InventoryLoadingState({ rows = 6 }: { rows?: number }) {
  return (
    <Card className="border-white/10 bg-[#18181B] text-white shadow-xl">
      <CardContent className="space-y-3 p-6">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-2xl bg-black/20" />
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dedicated state nodes feeding into the <TableFilters /> properties
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await adminProductService.getAll();
      setProducts(res.items || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleApplyFilters = () => {
    toast.info("Inventory filter parameters successfully verified");
  };

  // Upstream computed matrix pipeline that hooks filters to the table rows
  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        (product.category || "").toLowerCase().includes(q) ||
        (product.brand || "").toLowerCase().includes(q);

      const matchesCategory =
        category === "all" ||
        (product.category || "").toLowerCase() === category.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        (product.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, statusFilter]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const outOfStock = products.filter((product) => !product.stock || product.stock <= 0).length;
    const lowStock = products.filter((product) => product.stock && product.stock > 0 && product.stock <= 5).length;
    const healthyStock = Math.max(totalProducts - lowStock - outOfStock, 0);
    const featured = products.filter((product) => product.isFeatured).length;

    return {
      totalProducts,
      outOfStock,
      lowStock,
      healthyStock,
      featured,
      attentionRate: totalProducts > 0 ? Math.round(((lowStock + outOfStock) / totalProducts) * 100) : 0,
    };
  }, [products]);

  const selectedHealth = useMemo(() => {
    if (!selectedProduct) return null;
    const stock = selectedProduct.stock ?? 0;

    if (stock <= 0) {
      return { label: "Out of stock", tone: "border-red-500/20 bg-red-500/10 text-red-300" };
    }
    if (stock <= 5) {
      return { label: "Low stock", tone: "border-amber-500/20 bg-amber-500/10 text-amber-300" };
    }
    return { label: "Healthy stock", tone: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" };
  }, [selectedProduct]);

  const inventoryColumns = useMemo<ColumnDef<Product>[]>(() => [
    { id: "drag", header: () => null, cell: () => <DragHandle /> },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />
      ),
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
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
          className="flex items-center gap-3 text-left bg-transparent border-none p-0 cursor-pointer w-full group"
        >
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-black/20 border border-white/10">
            <img src={row.original.images?.[0] || "/placeholder-product.png"} alt={row.original.name} className="h-full w-full object-contain p-1" />
          </div>
          <div>
            <p className="font-medium text-white group-hover:text-zinc-300 group-hover:underline">{row.original.name}</p>
            <p className="text-xs text-zinc-500 line-clamp-1 max-w-[180px]">{row.original.description}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: "category", header: "Category", cell: ({ row }) => <span className="text-zinc-300 text-sm capitalize">{row.original.category || "—"}</span> },
    { accessorKey: "stock", header: "Stock", cell: ({ row }) => <span className="text-zinc-300 text-sm font-mono">{row.original.stock ?? 0}</span> },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "unknown";
        return (
          <Badge className={`rounded-full border px-2 py-0.5 font-normal uppercase text-[10px] tracking-wider ${statusStyles[status] || "border-white/10 bg-transparent text-white"}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <Button
            type="button"
            onClick={() => setSelectedProduct(row.original)}
            variant="ghost"
            size="sm"
            className="rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 gap-1"
          >
            <Eye className="size-3.5" />
            Inspect
          </Button>
        </div>
      ),
    },
  ], []);

  return (
    <AdminPageShell
      title="Inventory"
      description="Monitor stock levels, identify low inventory, and keep products ready to sell."
      actions={
        <Button onClick={loadProducts} className="rounded-xl bg-[#DB4444] text-white hover:bg-[#c53a3a]">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      }
    >
      <div className="space-y-6">

        {/* Workspace Operations View Layout Container width */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <InventoryLoadingState rows={6} />
          ) : (
            <TableData
              data={filteredProducts}
              columns={inventoryColumns}
              selectedItem={selectedProduct}
              onSelectedItemChange={setSelectedProduct}
              /* MOUNTED GENERIC TABLE FILTERS COMPONENT HERE */
              filterToolbar={
                <TableFilters
                  search={search}
                  setSearch={setSearch}
                  department={category}
                  setDepartment={setCategory}
                  status={statusFilter}
                  setStatus={setStatusFilter}
                  onApply={handleApplyFilters}
                />
              }
            >
              <RowDetailsOverlay
                title={selectedProduct?.name || "Product Specification"}
                description={selectedProduct?.brand ? `Brand Catalog: ${selectedProduct.brand}` : "Inventory Asset Analysis"}
                variant="drawer"
              >
                {selectedProduct && (
                  <div className="space-y-6">
                    
                    {/* Media Profile Layout Header Summary */}
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center">
                        <img src={selectedProduct.images?.[0] || "/placeholder-product.png"} alt={selectedProduct.name} className="h-full w-full object-contain p-1" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">Warehouse Status</span>
                        {selectedHealth && (
                          <Badge className={`rounded-full border px-2 py-0.5 font-normal uppercase text-[9px] tracking-wider ${selectedHealth.tone}`}>
                            {selectedHealth.label}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Parametric Data Grid Layout */}
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                          <Package className="size-4" /> Units in Stock
                        </div>
                        <p className="text-xl font-bold font-mono text-white">{selectedProduct.stock ?? 0}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                          <Layers className="size-4" /> Category
                        </div>
                        <p className="text-sm font-semibold capitalize text-white">{selectedProduct.category || "—"}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                          <Tags className="size-4" /> Brand Value
                        </div>
                        <p className="text-sm font-semibold text-white">{selectedProduct.brand || "—"}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                          <ShieldCheck className="size-4" /> Listing Visibility
                        </div>
                        <Badge className={`rounded-full border px-2 py-0.5 font-normal uppercase text-[9px] tracking-wider ${statusStyles[selectedProduct.status || ""] || "border-white/10 text-white"}`}>
                          {selectedProduct.status || "unknown"}
                        </Badge>
                      </div>
                    </div>

                    {/* Descriptive Asset Statement */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">Product Catalog Description</p>
                      <p className="text-sm leading-relaxed text-zinc-300">{selectedProduct.description || "No description logged for this warehouse catalog product entry."}</p>
                    </div>

                    {/* Logistical Warning Panel */}
                    <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200/90 leading-relaxed">
                        <strong>Logistical Warning Note:</strong> Modifying catalog metadata properties changes public storefront visibility parameters instantly. Double check metrics before processing changes.
                      </div>
                    </div>

                  </div>
                )}
              </RowDetailsOverlay>
            </TableData>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}