import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import AdminPageShell from "../components/AdminPageShell";
import InventoryStats from "../components/InventoryStats";
import InventoryTable from "../components/InventoryTable";
import { adminProductService } from "../services/product.service";
import type { Product } from "@/features/products/types/product.types";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return products;

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(q) ||
        (product.category || "").toLowerCase().includes(q) ||
        (product.brand || "").toLowerCase().includes(q)
      );
    });
  }, [products, search]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const outOfStock = products.filter((product) => !product.stock || product.stock <= 0).length;
    const lowStock = products.filter(
      (product) => product.stock && product.stock > 0 && product.stock <= 5
    ).length;
    const healthyStock = totalProducts - lowStock - outOfStock;

    return {
      totalProducts,
      outOfStock,
      lowStock,
      healthyStock,
    };
  }, [products]);

  return (
    <AdminPageShell
      title="Inventory"
      description="Monitor stock levels, identify low inventory, and keep products ready to sell."
      actions={
        <Button
          onClick={loadProducts}
          className="rounded-xl bg-red-500 hover:bg-red-600"
        >
          Refresh
        </Button>
      }
    >
      <InventoryStats
        totalProducts={stats.totalProducts}
        healthyStock={stats.healthyStock}
        lowStock={stats.lowStock}
        outOfStock={stats.outOfStock}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Search Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product, category, or brand..."
                className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
              />
            </CardContent>
          </Card>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
              Loading inventory...
            </div>
          ) : (
            <InventoryTable
              products={filteredProducts}
              onEdit={(product) => setSelectedProduct(product)}
            />
          )}
        </div>

        <div className="space-y-4">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Inventory Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-300">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span>Healthy stock</span>
                <span className="text-emerald-400">{stats.healthyStock}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span>Low stock</span>
                <span className="text-amber-400">{stats.lowStock}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span>Out of stock</span>
                <span className="text-red-400">{stats.outOfStock}</span>
              </div>
            </CardContent>
          </Card>

          {selectedProduct ? (
            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle>Selected Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-zinc-300">
                <div>
                  <p className="text-zinc-500">Name</p>
                  <p>{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Stock</p>
                  <p>{selectedProduct.stock ?? 0}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Category</p>
                  <p>{selectedProduct.category || "—"}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Status</p>
                  <p className="capitalize">{selectedProduct.status || "unknown"}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle>Quick Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-400">
                Select a product to inspect its stock details and current health.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}