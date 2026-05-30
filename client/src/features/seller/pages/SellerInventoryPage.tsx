"use client";

import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle, Loader2, Edit2, Package, CheckCircle2, AlertCircle } from "lucide-react";

import { useSellerProducts } from "../hooks/use-seller-products";
import TableData from "@/shared/components/data-table/TableData"; 
import type { Product } from "@/features/products/types/product.types"; 

// --- Helper Functions for Badges ---
function getStockLabel(stock?: number) {
  if (stock === undefined || stock <= 0) return "Out of stock";
  if (stock <= 5) return "Low stock";
  return "Healthy";
}

function getStockBadgeClass(stock?: number) {
  if (stock === undefined || stock <= 0) return "border-red-500/20 bg-red-500/15 text-red-400";
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
  const { products, stats, isLoading, error, refreshProducts } = useSellerProducts();

  // OPTIONAL: If your TableData relies purely on client-side state handling, 
  // you might want to break past the default limit of 10 items on mount:
  // useEffect(() => {
  //   refreshProducts(1, 100); 
  // }, []);

  // --- TanStack Table Column Definition ---
  const columns = useMemo<ColumnDef<Product>[]>(() => [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/20 flex items-center justify-center">
              <img
                src={product.images?.[0] || "/placeholder-product.png"}
                alt={product.name}
                className="h-full w-full object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-product.png";
                }}
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
        <Badge className={`border px-2 py-0.5 whitespace-nowrap shadow-none font-normal ${getStockBadgeClass(row.original.stock)}`}>
          {getStockLabel(row.original.stock)}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={`border capitalize px-2 py-0.5 shadow-none font-normal ${getStatusBadgeClass(row.original.status)}`}>
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
            className="rounded-xl border-white/10 bg-transparent hover:bg-white/5 h-8 px-3 text-zinc-200 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
        </div>
      ),
    },
  ], [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111113] flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="h-8 w-8 animate-spin text-[#DB4444] mb-4" />
        <p className="text-sm tracking-wide">Loading inventory metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111113] flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md border-red-900 bg-red-950/20 text-red-200">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <AlertDescription className="ml-2">
            {error}. Please refresh your dashboard or try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Safe fallback counts using explicit variables to protect mathematical assertions 
  // against partial array payloads caused by api item page limitations.
  const totalProducts = stats?.totalProducts ?? products.length;
  const lowStockCount = stats?.lowStockProducts ?? products.filter(p => (p.stock ?? 0) <= 5 && (p.stock ?? 0) > 0).length;
  const outOfStockCount = stats?.outOfStockProducts ?? products.filter(p => (p.stock ?? 0) <= 0).length;
  
  const criticalItemsCount = lowStockCount + outOfStockCount;
  const healthyStockCount = Math.max(0, totalProducts - criticalItemsCount);

  return (
    <div className="min-h-screen bg-[#111113] text-white px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8 text-left">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Inventory</h1>
            <p className="mt-2 text-zinc-400 text-sm">Track real-time quantities, health configurations, and stock levels.</p>
          </div>
          <Button 
            onClick={() => navigate("/seller/products/new")}
            className="bg-[#DB4444] hover:bg-red-600 text-white rounded-xl h-10 px-4 font-medium self-start sm:self-center transition-all"
          >
            Add New Product
          </Button>
        </div>

        {/* Dynamic Warning Alert banner */}
        {criticalItemsCount > 0 && (
          <Alert className="border-amber-800/40 bg-amber-950/10 backdrop-blur-sm">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-200/90 ml-2">
              {criticalItemsCount} item{criticalItemsCount > 1 ? 's are' : ' is'} demanding operational attention ({outOfStockCount} out of stock, {lowStockCount} critical). Please update your inventory pipeline to avoid drop-offs.
            </AlertDescription>
          </Alert>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#18181B] border-white/10 shadow-xl">
            <CardContent className="pt-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400 mb-1">Total SKU Inventory</p>
                <p className="text-3xl font-bold text-white tracking-tight">{totalProducts}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-white/5">
                <Package className="w-5 h-5 text-zinc-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-white/10 shadow-xl">
            <CardContent className="pt-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400 mb-1">Healthy SKUs</p>
                <p className="text-3xl font-bold text-emerald-400 tracking-tight">{healthyStockCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-white/10 shadow-xl">
            <CardContent className="pt-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400 mb-1">Attention Required</p>
                <p className="text-3xl font-bold text-amber-500 tracking-tight">{criticalItemsCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/10">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table Implementation */}
        <div className="rounded-xl border border-white/10 bg-[#18181B] overflow-hidden">
          <TableData<Product> 
            data={products} 
            columns={columns} 
          />
        </div>
        
      </div>
    </div>
  );
}