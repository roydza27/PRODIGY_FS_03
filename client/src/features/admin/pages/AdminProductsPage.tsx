"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import AdminPageShell from "../components/AdminPageShell";
import ProductTable from "../components/ProductTable";
import { adminProductService } from "../services/product.service";
import type { Product } from "@/features/products/types/product.types";
import ConfirmDialog from "@/shared/components/confirm-dialog/ConfirmDialog";
import { EmptyState, ErrorState, TableSkeleton } from "@/shared/components/page-state";
import { Plus, RefreshCw, Sparkles, Package, Tags, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminProductService.getAll();
      setProducts(res.items || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load products";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ROUTING FIX: Guides the router straight to your administrative sub-path editor layout
  const handleOpenEdit = (product: Product) => {
    navigate(`/admin/products/${product._id}/edit`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setSubmitting(true);
      await adminProductService.remove(deleteTarget._id);
      toast.success("Product deleted successfully");
      setDeleteTarget(null);
      await loadProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (product: Product) => {
    // FIX: Pushes the navigation matrix straight to the uniform /:id path expected by the form page params
    navigate(`/admin/products/${product._id}/edit`);
  };

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === "active").length;
    const draft = products.filter((p) => p.status === "draft").length;
    const featured = products.filter((p) => p.isFeatured).length;

    return [
      { label: "Total Products", value: total, icon: Package, hint: "All catalog items" },
      { label: "Active Listings", value: active, icon: Sparkles, hint: "Live in store" },
      { label: "Draft Items", value: draft, icon: Tags, hint: "Need review" },
      { label: "Featured", value: featured, icon: DollarSign, hint: "Promoted products" },
    ];
  }, [products]);

  return (
    <AdminPageShell
      title="Products"
      description="Manage your catalog, pricing, stock, and visibility parameters from a single view."
      actions={
        <div className="flex gap-2.5">
          <Button
            onClick={loadProducts}
            variant="outline"
            className="rounded-xl border-white/10 bg-black/20 text-white hover:bg-white/5 h-11"
          >
            <RefreshCw className="h-4 w-4 shrink-0" />
          </Button>
          <Button
            onClick={() => navigate("/admin/products/create")}
            className="rounded-xl bg-[#DB4444] text-white hover:bg-[#c53a3a] h-11 px-5 font-medium transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* Fully Responsive Stats Grid Layer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-white/10 bg-[#18181B] shadow-xl rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500 truncate">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-white font-mono truncate">{stat.value}</p>
                      <p className="mt-1 text-xs text-zinc-400 font-medium truncate">{stat.hint}</p>
                    </div>
                    <div className="rounded-2xl border border-[#DB4444]/20 bg-[#DB4444]/10 p-3 text-[#DB4444] shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dynamic Presentation Pipeline Layer */}
        {loading ? (
          <TableSkeleton rows={6} />
        ) : error ? (
          <ErrorState error={error} onAction={loadProducts} actionLabel="Retry Pipeline" />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Your inventory registry is currently empty."
            actionLabel="Create First Product"
            onAction={() => navigate("/admin/products/create")}
          />
        ) : (
          <ProductTable 
            products={products} 
            onEdit={handleOpenEdit} 
            onDelete={setDeleteTarget} 
          />
        )}
      </div>

      {/* Persistent Overlay Asset Destructive Confirmation Modals */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete product catalog entry?"
        description={`Are you sure you want to permanently delete "${deleteTarget?.name || "this item"}"? This action drops all database associations and cannot be undone.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        loading={submitting}
        onConfirm={handleDelete}
      />
    </AdminPageShell>
  );
}