"use client";

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle, Loader2, Edit2 } from "lucide-react";

import { useSellerProducts } from "../hooks/use-seller-products";
import TableData from "@/shared/components/data-table/TableData";
import type { Product } from "@/features/products/types/product.types";

// --- Helper Functions for Badges ---
function getStockLabel(stock?: number) {
  if (!stock || stock <= 0) return "Out of stock";
  if (stock <= 5) return "Low stock";
  return "Healthy";
}

function getStockBadgeClass(stock?: number) {
  if (!stock || stock <= 0) return "border-red-500/20 bg-red-500/15 text-red-400";
  if (stock <= 5) return "border-amber-500/20 bg-amber-500/15 text-amber-400";
  return "border-emerald-500/20 bg-emerald-500/15 text-emerald-400";
}

function getStatusBadgeClass(status?: string) {
  switch (status) {
    case "active": return "border-emerald-500/20 bg-emerald-500/15 text-emerald-400";
    case "draft": return "border-amber-500/20 bg-amber-500/15 text-amber-400";
    default: return "border-zinc-500/20 bg-zinc-500/15 text-zinc-300";
  }
}

export default function SellerInventoryPage() {
  const navigate = useNavigate();
  const { products, isLoading } = useSellerProducts();

  // --- TanStack Table Column Definition ---
  const columns = useMemo<ColumnDef<Product>[]>(() => [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/20">
              <img
                src={product.images?.[0] || "/placeholder-product.png"}
                alt={product.name}
                className="h-full w-full object-contain p-1"
              />
            </div>
            <div>
              <p className="font-medium text-white">{product.name}</p>
              <p className="text-xs text-zinc-500 line-clamp-1 max-w-[200px]">
                {product.description || "No description"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span className="text-sm text-zinc-300 capitalize">{row.original.category || "—"}</span>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => <span className="text-sm text-zinc-300">{row.original.stock ?? 0}</span>,
    },
    {
      id: "health",
      header: "Health",
      cell: ({ row }) => (
        <Badge className={`border px-2 py-0.5 whitespace-nowrap ${getStockBadgeClass(row.original.stock)}`}>
          {getStockLabel(row.original.stock)}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={`border capitalize px-2 py-0.5 ${getStatusBadgeClass(row.original.status)}`}>
          {row.original.status || "unknown"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right w-full">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => navigate(`/seller/products/${row.original._id}/edit`)}
            variant="outline"
            className="rounded-xl border-white/10 bg-transparent hover:bg-white/5 h-8 px-3"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      ),
    },
  ], [navigate]);

  // --- Dynamic Inventory Analytics ---
  const inStockItems = products.filter((p) => (p.stock ?? 0) > 5);
  const lowStockItems = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5);
  const outOfStockItems = products.filter((p) => (p.stock ?? 0) <= 0);
  const totalAlertItems = lowStockItems.length + outOfStockItems.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111113] flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="h-8 w-8 animate-spin text-[#DB4444] mb-4" />
        <p>Loading inventory data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111113] text-white px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8 text-left">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Inventory</h1>
          <p className="mt-2 text-zinc-400">Track and manage stock levels.</p>
        </div>

        {/* Alerts */}
        {totalAlertItems > 0 && (
          <Alert className="border-yellow-800 bg-yellow-900/20">
            <AlertTriangle className="h-4 w-4 text-yellow-200" />
            <AlertDescription className="text-yellow-100">
              {totalAlertItems} item(s) have low or zero stock. Please review your inventory to prevent missed sales.
            </AlertDescription>
          </Alert>
        )}

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#18181B] border-white/10 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-400 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-white">{products.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#18181B] border-white/10 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-400 mb-1">Healthy Stock</p>
              <p className="text-3xl font-bold text-emerald-400">{inStockItems.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#18181B] border-white/10 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-400 mb-1">Needs Attention</p>
              <p className="text-3xl font-bold text-amber-400">{totalAlertItems}</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table Implementation */}
        <div className="bg-[#18181B] border border-white/10 shadow-xl rounded-xl overflow-hidden p-4">
           {/* Injecting your robust TableData component */}
           <TableData<Product> 
             data={products} 
             columns={columns} 
           />
        </div>
        
      </div>
    </div>
  );
}