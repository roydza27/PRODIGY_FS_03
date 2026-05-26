"use client";

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  GripVertical, 
  Package, 
  Layers, 
  Tag, 
  Boxes 
} from "lucide-react";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import TableData from "@/shared/components/data-table/TableData";
import { RowDetailsOverlay } from "@/shared/components/data-table/RowDetailsOverlay";
import { TableFilters } from "@/shared/components/data-table/TableFilters";
import ConfirmDialog from "@/shared/components/confirm-dialog/ConfirmDialog";
import { useSellerProducts } from "../hooks/use-seller-products";

interface SellerProductItem {
  _id: string;
  id?: string;
  name: string;
  category: string;
  status: "active" | "draft" | "archived";
  price: number;
  stock: number;
  description?: string;
  images?: string[];
  brand?: string;
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  draft: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  archived: "bg-zinc-800 text-zinc-300 border border-white/5",
};

function DragHandle() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5">
      <GripVertical className="size-4" />
    </div>
  );
}

export default function SellerProductsPage() {
  const navigate = useNavigate();
  const { products, isLoading, deleteProduct } = useSellerProducts();
  
  // State Synchronization Hooks matching <TableFilters /> properties perfectly
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all"); 
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft" | "archived">("all");
  const [selectedProduct, setSelectedProduct] = useState<SellerProductItem | null>(null);

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      if (selectedProduct?._id === productId) setSelectedProduct(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const handleApplyFilters = () => {
    toast.info("Inventory filters applied successfully");
  };

  // Comprehensive multi-parameter item filtering computation pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search filter matches product name or brand reference
      const matchesSearch = !searchTerm || 
                            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (p.brand || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Category filter maps cleanly onto the "department" selector parameter
      const matchesCategory = categoryFilter === "all" || 
                              (p.category || "").toLowerCase() === categoryFilter.toLowerCase();
      
      // 3. Status filter matches both top-level tab states or internal toolbar selectors
      const matchesStatus = filterStatus === "all" || p.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, filterStatus]);

  // Structural TanStack Column Schema definitions local to store configurations
  const columns = useMemo<ColumnDef<SellerProductItem>[]>(() => [
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
          className="flex items-center gap-3 text-left bg-transparent border-none p-0 cursor-pointer w-full group"
        >
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-black/20 border border-white/10 flex items-center justify-center">
            <img 
              src={row.original.images?.[0] || "/placeholder-product.png"} 
              alt={row.original.name} 
              className="h-full w-full object-contain p-1" 
            />
          </div>
          <div>
            <p className="font-medium text-white group-hover:text-zinc-300 group-hover:underline leading-tight">{row.original.name}</p>
            <p className="text-xs text-zinc-500 capitalize">{row.original.category || "Uncategorized"}</p>
          </div>
        </button>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={`capitalize rounded-full px-2.5 py-0.5 ${statusStyles[row.original.status] || ""}`}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: () => <div className="text-right w-full">Price</div>,
      cell: ({ row }) => <div className="text-right font-medium text-zinc-200">₹{row.original.price?.toLocaleString()}</div>,
    },
    {
      accessorKey: "stock",
      header: () => <div className="text-right w-full">Stock</div>,
      cell: ({ row }) => <div className="text-right font-mono text-zinc-300">{row.original.stock}</div>,
    },
    {
      id: "actions",
      header: () => <div className="text-center w-full">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={() => navigate(`/seller/products/${row.original._id}/edit`)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          
          <ConfirmDialog
            title="Delete this listing?"
            description={`Are you sure you want to permanently delete "${row.original.name}"? This action removes all public storefront metrics and cannot be undone.`}
            confirmLabel="Confirm Delete"
            onConfirm={() => handleDelete(row.original._id)}
            trigger={
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-400">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      ),
    },
  ], [products, navigate]);

  return (
    <div className="min-h-screen bg-[#111113] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8 text-left">
        
        {/* Header Grid Section */}
        <div className="mx-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="mt-1 text-zinc-400">Manage your store listings, stock levels, and pricing.</p>
          </div>
          <Button onClick={() => navigate("/seller/products/create")} className="rounded-xl bg-[#DB4444] hover:bg-[#c53a3a] h-11 text-white px-5 font-medium transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>

        {/* Interactive Data Presentation Engine Layer */}
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center text-zinc-500 border border-white/5 bg-[#111113] rounded-2xl">
            <Loader2 className="w-7 h-7 animate-spin mb-4 text-[#DB4444]" /> 
            <span className="text-sm font-medium tracking-wide">Loading product inventory logs...</span>
          </div>
        ) : (
          <TableData
            data={filteredProducts}
            columns={columns}
            selectedItem={selectedProduct}
            onSelectedItemChange={setSelectedProduct}
            /* HOOKED FILTER TOOLBAR SLOT PROPS DIRECTLY IN THE RENDER BLOCK */
            filterToolbar={
              <TableFilters
                search={searchTerm}
                setSearch={setSearchTerm}
                department={categoryFilter}
                setDepartment={setCategoryFilter}
                status={filterStatus}
                setStatus={setFilterStatus as any}
                onApply={handleApplyFilters}
              />
            }
          >
            {/* Sliding overlay structural layout pane details sheet */}
            <RowDetailsOverlay
              title={selectedProduct?.name || "Product Profile Overview"}
              description={selectedProduct?.brand ? `Brand Collection: ${selectedProduct.brand}` : "Logistical Merchandising Telemetry Profile"}
              variant="drawer"
            >
              {selectedProduct && (
                <div className="space-y-6">
                  
                  {/* Media Snapshot Banner Summary Component */}
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center">
                      <img src={selectedProduct.images?.[0] || "/placeholder-product.png"} alt={selectedProduct.name} className="h-full w-full object-contain p-1" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold tracking-tight text-white leading-tight">{selectedProduct.name}</h4>
                      <Badge className={`rounded-full border px-2 py-0.5 font-normal uppercase text-[9px] tracking-wider ${statusStyles[selectedProduct.status] || ""}`}>
                        {selectedProduct.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Informational Profile Parameter Information Cards Grid */}
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                        <Tag className="size-4" /> Retail Valuation
                      </div>
                      <p className="text-xl font-bold text-white">₹{selectedProduct.price?.toLocaleString()}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                        <Boxes className="size-4" /> Stock Units Available
                      </div>
                      <p className="text-sm font-semibold text-white font-mono">{selectedProduct.stock} items</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                        <Layers className="size-4" /> System Category
                      </div>
                      <p className="text-sm font-semibold capitalize text-white">{selectedProduct.category || "—"}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                        <Package className="size-4" /> Brand Identifier
                      </div>
                      <p className="text-sm font-semibold text-white">{selectedProduct.brand || "Generics Log"}</p>
                    </div>
                  </div>

                  {/* Descriptive Context Statement */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">Storefront Listing Description</p>
                    <p className="text-sm leading-relaxed text-zinc-300">
                      {selectedProduct.description || "No specific detailed description contextual summaries logged for this inventory product block."}
                    </p>
                  </div>

                  {/* Utility Modification Actions Footer Tray Panels */}
                  <div className="pt-4 border-t border-white/5 flex gap-3">
                    <Button
                      type="button"
                      className="flex-1 bg-white/10 text-white hover:bg-white/15 border border-white/10 rounded-xl h-11 transition-colors font-medium text-xs tracking-wide uppercase"
                      onClick={() => {
                        navigate(`/seller/products/${selectedProduct._id}/edit`);
                        setSelectedProduct(null);
                      }}
                    >
                      Launch Configuration Editor
                    </Button>
                    
                    <ConfirmDialog
                      title="Permanently Delete Listing?"
                      description={`This removes "${selectedProduct.name}" off your catalog configurations completely.`}
                      confirmLabel="Delete Permanent"
                      onConfirm={() => handleDelete(selectedProduct._id)}
                      trigger={
                        <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 bg-transparent rounded-xl h-11 px-4 transition-colors">
                          <Trash2 className="size-4" />
                        </Button>
                      }
                    />
                  </div>

                </div>
              )}
            </RowDetailsOverlay>
          </TableData>
        )}
      </div>
    </div>
  );
}