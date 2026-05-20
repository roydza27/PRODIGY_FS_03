import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import type { Product } from "@/features/products/types/product.types";

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  category: string;
  brand: string;
  imageUrl: string;
  status: "draft" | "active" | "archived";
  isFeatured: boolean;
};

type Props = {
  initialValue?: Product | null;
  onSubmit: (payload: Partial<Product>) => Promise<void>;
  submitting?: boolean;
  onCancel?: () => void;
};

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  compareAtPrice: "",
  stock: "",
  category: "",
  brand: "",
  imageUrl: "",
  status: "active",
  isFeatured: false,
};

export default function ProductForm({
  initialValue,
  onSubmit,
  submitting,
  onCancel,
}: Props) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || "",
        description: initialValue.description || "",
        price: String(initialValue.price ?? ""),
        compareAtPrice: String(initialValue.compareAtPrice ?? ""),
        stock: String(initialValue.stock ?? ""),
        category: initialValue.category || "",
        brand: initialValue.brand || "",
        imageUrl: initialValue.images?.[0] || "",
        status: initialValue.status || "active",
        isFeatured: Boolean(initialValue.isFeatured),
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialValue]);

  const toSlug = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const update = <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: Partial<Product> = {
      name: form.name.trim(),
      slug: toSlug(form.name),
      description: form.description.trim(),
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      stock: form.stock ? Number(form.stock) : 0,
      category: form.category.trim(),
      brand: form.brand.trim(),
      status: form.status,
      isFeatured: form.isFeatured,
      images: form.imageUrl ? [form.imageUrl.trim()] : [],
    };

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-white sm:p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">
          {initialValue ? "Edit Product" : "Create Product"}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Keep product details clear and ready for the catalog.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm text-zinc-400">Name</label>
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Product name"
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm text-zinc-400">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Product description"
            className="min-h-28 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Price</label>
          <Input
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="7999"
            type="number"
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Compare At Price</label>
          <Input
            value={form.compareAtPrice}
            onChange={(e) => update("compareAtPrice", e.target.value)}
            placeholder="8999"
            type="number"
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Stock</label>
          <Input
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
            placeholder="12"
            type="number"
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Category</label>
          <Input
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            placeholder="electronics"
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Brand</label>
          <Input
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="Apple"
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Image URL</label>
          <Input
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
            placeholder="https://..."
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Status</label>
          <select
            value={form.status}
            onChange={(e) =>
              update("status", e.target.value as ProductFormData["status"])
            }
            className="h-10 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(e) => update("isFeatured", e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-black/20"
        />
        Featured product
      </label>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : initialValue ? "Update Product" : "Create Product"}
        </Button>

        {onCancel ? (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
          >
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}