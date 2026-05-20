import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import AdminPageShell from "../components/AdminPageShell";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import { adminProductService } from "../services/product.service";
import type { Product } from "@/features/products/types/product.types";
import ConfirmDialog from "@/shared/components/confirm-dialog/ConfirmDialog";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await adminProductService.getAll();
      setProducts(res.items || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load products");
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

  const openCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedProduct(null);
    setIsFormOpen(false);
  };

  const handleSave = async (payload: Partial<Product>) => {
    try {
      setSubmitting(true);

      if (selectedProduct) {
        await adminProductService.update(selectedProduct._id, payload);
        toast.success("Product updated");
      } else {
        await adminProductService.create(payload);
        toast.success("Product created");
      }

      closeForm();
      await loadProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      setSubmitting(true);
      await adminProductService.remove(product._id);
      toast.success("Product deleted");
      await loadProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminPageShell
      title="Products"
      description="Manage your catalog, pricing, stock, and visibility."
      actions={
        <Button
          onClick={openCreate}
          className="rounded-xl bg-red-500 hover:bg-red-600"
        >
          Add Product
        </Button>
      }
    >
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, or brand..."
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />
        </CardContent>
      </Card>

      {isFormOpen ? (
        <ProductForm
          initialValue={selectedProduct}
          onSubmit={handleSave}
          submitting={submitting}
          onCancel={closeForm}
        />
      ) : null}

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <ErrorState
          error={error}
          onAction={loadProducts}
          actionLabel="Retry"
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try changing your search or filters."
          actionLabel="Clear filters"
          onAction={() => {
            setSearch("");
            setCategory("");
            setSortBy("newest");
          }}
        />
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}
    </AdminPageShell>
  );
}