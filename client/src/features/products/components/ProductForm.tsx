import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import ProductSpecifications from "./ProductSpecifications";
import ProductFAQ from "./ProductFAQ";
import type { FAQItem } from "../types";

export type ProductCategory =
  | "electronics"
  | "fashion"
  | "home"
  | "groceries"
  | "beauty"
  | "sports"
  | "toys"
  | "books"
  | "other";

export type ProductStatus = "draft" | "active" | "archived";

export type SpecItem = {
  label: string;
  value: string;
};

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  compareAtPrice: number;
  stock: number;
  category: ProductCategory;
  images: string[];
  status: ProductStatus;
  isFeatured: boolean;
  specifications: SpecItem[];
  faqs: FAQItem[];
};

type Props = {
  mode: "create" | "edit";
  initialValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues & { slug: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  title?: string;
  subtitle?: string;
};

const CATEGORIES: ProductCategory[] = [
  "electronics",
  "fashion",
  "home",
  "groceries",
  "beauty",
  "sports",
  "toys",
  "books",
  "other",
];

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  compareAtPrice: 0,
  stock: 0,
  category: "electronics",
  images: [],
  status: "draft",
  isFeatured: false,
  specifications: [{ label: "", value: "" }],
  faqs: [{ question: "", answer: "" }],
};

export default function ProductForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  title,
  subtitle,
}: Props) {

  const normalizedInitialValues: ProductFormValues = {
    ...(initialValues ?? DEFAULT_VALUES),
    specifications: initialValues?.specifications?.length
      ? initialValues.specifications
      : [{ label: "", value: "" }],
    faqs: initialValues?.faqs?.length
      ? initialValues.faqs
      : [{ question: "", answer: "" }],
  };

  const [values, setValues] = useState<ProductFormValues>(normalizedInitialValues);
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const slug = useMemo(() => {
    return values.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [values.name]);

  const discountedPrice = useMemo(() => {
    const compare = Number(values.compareAtPrice || 0);
    const price = Number(values.price || 0);
    if (compare > price && compare > 0) {
      return Math.round(((compare - price) / compare) * 100);
    }
    return 0;
  }, [values.compareAtPrice, values.price]);

  function validateForm() {
    const nextErrors: Record<string, string> = {};

    if (!values.name.trim()) nextErrors.name = "Product name is required";
    else if (values.name.trim().length < 3) {
      nextErrors.name = "Product name must be at least 3 characters";
    }

    if (!values.description.trim()) nextErrors.description = "Description is required";
    else if (values.description.trim().length < 10) {
      nextErrors.description = "Description must be at least 10 characters";
    }

    if (values.price <= 0) nextErrors.price = "Price must be greater than 0";
    if (values.stock < 0) nextErrors.stock = "Stock cannot be negative";
    if (values.images.length === 0) nextErrors.images = "At least one image is required";
    if (values.compareAtPrice < 0) nextErrors.compareAtPrice = "Compare price cannot be negative";
    if ( !values.specifications.length || values.specifications.some((spec) => !spec.label.trim() || !spec.value.trim())) {
      nextErrors.specifications = "Add at least one valid specification";
    }

    if (values.faqs.some((faq) => !faq.question.trim() || !faq.answer.trim())) {
      nextErrors.faqs = "All FAQ fields must be completed";
    }
    
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleAddImage() {
    if (!imageUrl.trim()) {
      return setErrors((prev) => ({ ...prev, images: "Please enter an image URL" }));
    }

    try {
      new URL(imageUrl);
    } catch {
      return setErrors((prev) => ({ ...prev, images: "Please enter a valid image URL" }));
    }

    setValues((prev) => ({
      ...prev,
      images: [...prev.images, imageUrl.trim()],
    }));
    setImageUrl("");
    setErrors((prev) => {
      const next = { ...prev };
      delete next.images;
      return next;
    });
  }

  function handleRemoveImage(index: number) {
    setValues((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function handleAddSpec() {
    setValues((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  }

  function handleUpdateSpec(index: number, key: "label" | "value", value: string) {
    setValues((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [key]: value } : spec
      ),
    }));
  }

  function handleRemoveSpec(index: number) {
    setValues((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  }

  function handleAddFAQ() {
    setValues((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  }

  function handleUpdateFAQ(
    index: number,
    key: "question" | "answer",
    value: string
  ) {
    setValues((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [key]: value } : faq
      ),
    }));
  }

  function handleRemoveFAQ(index: number) {
    setValues((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    await onSubmit({
      ...values,
      slug,
    });
  }

  return (
    <div className="min-h-screen bg-[#111113] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8 text-left">
        <div className="flex items-start gap-4">

          <div className="flex-1">
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title ?? (mode === "edit" ? "Edit Product" : "Create New Product")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
              {subtitle ??
                (mode === "edit"
                  ? "Update product details, pricing, images, and visibility from one clean workspace."
                  : "Add a new product with a polished workflow, instant preview, and cleaner structure.")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card className="border-white/10 bg-[#18181B] shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
                <CardDescription className="text-zinc-400">Name, description, and category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">Product Name *</label>
                  <Input
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    placeholder="Enter product name"
                    className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">Description *</label>
                  <Textarea
                    value={values.description}
                    onChange={(e) => setValues({ ...values, description: e.target.value })}
                    placeholder="Enter detailed product description"
                    className="min-h-28 border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">Category *</label>
                  <Select
                    value={values.category}
                    onValueChange={(v) => setValues({ ...values, category: v as ProductCategory })}
                  >
                    <SelectTrigger className="border-white/10 bg-black/20 text-white focus:ring-[#DB4444]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#18181B] text-white">
                      {CATEGORIES.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="capitalize focus:bg-[#DB4444]/10 focus:text-white"
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#18181B] shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Pricing</CardTitle>
                <CardDescription className="text-zinc-400">Set your product prices</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">Selling Price (₹) *</label>
                  <Input
                    type="number"
                    value={values.price}
                    onChange={(e) => setValues({ ...values, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">Compare Price (₹)</label>
                  <Input
                    type="number"
                    value={values.compareAtPrice}
                    onChange={(e) =>
                      setValues({ ...values, compareAtPrice: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                  />
                  {errors.compareAtPrice && (
                    <p className="mt-1 text-sm text-red-400">{errors.compareAtPrice}</p>
                  )}
                </div>

                <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
                  {discountedPrice > 0 ? (
                    <p>
                      Customers save{" "}
                      <span className="font-semibold text-[#DB4444]">{discountedPrice}%</span>{" "}
                      with the current pricing.
                    </p>
                  ) : (
                    <p className="text-zinc-400">Add a compare price to show discount details.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#18181B] shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Inventory</CardTitle>
                <CardDescription className="text-zinc-400">Stock and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">Stock Quantity *</label>
                  <Input
                    type="number"
                    value={values.stock}
                    onChange={(e) => setValues({ ...values, stock: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                  />
                  {errors.stock && <p className="mt-1 text-sm text-red-400">{errors.stock}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#18181B] shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Images</CardTitle>
                <CardDescription className="text-zinc-400">Product images and media</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                      className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddImage}
                    className="rounded-xl bg-[#DB4444] px-5 text-white hover:bg-[#c53a3a]"
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </div>

                {values.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {values.images.map((img, idx) => (
                      <div
                        key={`${img}-${idx}`}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-2"
                      >
                        <img
                          src={img}
                          alt={`Product ${idx + 1}`}
                          className="h-28 w-full rounded-xl object-cover transition duration-300 group-hover:scale-[1.02]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/320x240?text=Image+Unavailable";
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute right-3 top-3 h-8 w-8 rounded-full bg-[#DB4444] opacity-0 shadow-lg transition hover:bg-[#c53a3a] group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
                    <p className="text-sm text-zinc-400">No images added yet.</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Add at least one product image to continue.
                    </p>
                  </div>
                )}

                {errors.images && <p className="text-sm text-red-400">{errors.images}</p>}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#18181B] shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Status</CardTitle>
                <CardDescription className="text-zinc-400">
                  Product visibility and featured status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-200">
                      Product Status *
                    </label>
                    <Select
                      value={values.status}
                      onValueChange={(v) => setValues({ ...values, status: v as ProductStatus })}
                    >
                      <SelectTrigger className="border-white/10 bg-black/20 text-white focus:ring-[#DB4444]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-[#18181B] text-white">
                        <SelectItem value="draft" className="focus:bg-[#DB4444]/10 focus:text-white">
                          Draft
                        </SelectItem>
                        <SelectItem value="active" className="focus:bg-[#DB4444]/10 focus:text-white">
                          Active
                        </SelectItem>
                        <SelectItem value="archived" className="focus:bg-[#DB4444]/10 focus:text-white">
                          Archived
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-200">Featured Product</p>
                      <p className="text-xs text-zinc-400">Highlight this item in collections</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={values.isFeatured}
                      onChange={(e) => setValues({ ...values, isFeatured: e.target.checked })}
                      className="h-4 w-4 rounded border-zinc-600 bg-transparent accent-[#DB4444]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#18181B] shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Specifications</CardTitle>
                <CardDescription className="text-zinc-400">
                  Add key product details like material, size, battery, or warranty.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {(values.specifications ?? [{ label: "", value: "" }]).map((spec, idx) => (
                  <div key={idx} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <Input
                      value={spec.label}
                      onChange={(e) => handleUpdateSpec(idx, "label", e.target.value)}
                      placeholder="Label"
                      className="border-white/10 bg-black/20 text-white"
                    />
                    <Input
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                      placeholder="Value"
                      className="border-white/10 bg-black/20 text-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRemoveSpec(idx)}
                      className="border-white/10 bg-black/20"
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleAddSpec}
                  className="bg-[#DB4444] text-white"
                >
                  Add Specification
                </Button>

                {errors.specifications ? (
                  <p className="text-sm text-red-400">{errors.specifications}</p>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#18181B] shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">
                  Frequently Asked Questions
                </CardTitle>

                <CardDescription className="text-zinc-400">
                  Add common customer questions and answers.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {values.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <Input
                      value={faq.question}
                      onChange={(e) =>
                        handleUpdateFAQ(idx, "question", e.target.value)
                      }
                      placeholder="Question"
                      className="border-white/10 bg-black/20 text-white"
                    />

                    <Textarea
                      value={faq.answer}
                      onChange={(e) =>
                        handleUpdateFAQ(idx, "answer", e.target.value)
                      }
                      placeholder="Answer"
                      className="min-h-24 border-white/10 bg-black/20 text-white"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRemoveFAQ(idx)}
                      className="border-white/10 bg-black/20"
                    >
                      Remove FAQ
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleAddFAQ}
                  className="bg-[#DB4444] text-white hover:bg-[#c53a3a]"
                >
                  Add FAQ
                </Button>
              </CardContent>
            </Card>            
          </div>

          <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <Card className="border-white/10 bg-[#18181B] shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Live Preview</CardTitle>
                <CardDescription className="text-zinc-400">
                  See how the product will feel in the store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <div className="aspect-square w-full overflow-hidden bg-black/30">
                    {values.images[0] ? (
                      <img
                        src={values.images[0]}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/600x600?text=Preview";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                        No image preview
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="line-clamp-1 text-base font-semibold text-white">
                        {values.name || "Product name"}
                      </h3>
                      {values.isFeatured && (
                        <span className="rounded-full border border-[#DB4444]/20 bg-[#DB4444]/10 px-2 py-1 text-[11px] font-medium text-[#DB4444]">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="line-clamp-2 text-sm text-zinc-400">
                      {values.description || "Product description preview appears here."}
                    </p>

                    <div className="flex items-end justify-between pt-2">
                      <div>
                        <p className="text-xl font-bold text-white">₹{values.price || 0}</p>
                        {values.compareAtPrice > values.price && (
                          <p className="text-sm text-zinc-500 line-through">
                            ₹{values.compareAtPrice}
                          </p>
                        )}
                      </div>
                      <p className="text-sm capitalize text-zinc-400">{values.category}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#18181B] shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Product Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-zinc-300">
                <div className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                  <span>Name</span>
                  <span className="max-w-40 truncate text-white">{values.name || "—"}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                  <span>Slug</span>
                  <span className="max-w-40 truncate text-white">{slug || "—"}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                  <span>Images</span>
                  <span className="text-white">{values.images.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                  <span>Status</span>
                  <span className="capitalize text-white">{values.status}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                  <span>Featured</span>
                  <span className="text-white">{values.isFeatured ? "Yes" : "No"}</span>
                </div>
              </CardContent>
            </Card>

            <ProductSpecifications
              specs={values.specifications.filter(
                (spec) => spec.label.trim() && spec.value.trim()
              )}
            />

            <ProductFAQ
              items={values.faqs.filter(
                (faq) => faq.question.trim() && faq.answer.trim()
              )}
            />

            <div className="sticky bottom-4 z-10 rounded-2xl border border-white/10 bg-[#18181B]/95 p-3 backdrop-blur-xl xl:static xl:bg-transparent xl:p-0 xl:backdrop-blur-none">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 rounded-xl border-white/10 bg-black/20 text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-[#DB4444] text-white hover:bg-[#c53a3a]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === "edit" ? "Updating..." : "Creating..."}
                    </>
                  ) : mode === "edit" ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Update Product
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Create Product
                    </>
                  )}
                </Button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}