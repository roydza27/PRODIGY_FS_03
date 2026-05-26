"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import ProductForm, {
  type ProductFormValues,
  type ProductStatus,
} from "@/features/products/components/ProductForm";
import { useSellerProducts } from "../hooks/use-seller-products";
import { sellerProductService } from "../services/seller-product.service";
import type { ProductCategory } from "../services/seller-product.service";

type ProductFormState = ProductFormValues;

const initialFormData: ProductFormValues = {
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

export default function SellerProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createProduct, updateProduct } = useSellerProducts();

  const isEditMode = Boolean(id);
  const [initialValues, setInitialValues] = useState<ProductFormState | null>(
    isEditMode ? null : initialFormData
  );
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  useEffect(() => {
    if (!isEditMode || !id) return;

    async function loadProduct() {
      try {
        setIsLoadingProduct(true);
        const response = await sellerProductService.getProduct(id);
        const prod = response.data.product;

        setInitialValues({
          name: prod.name || "",
          description: prod.description || "",
          price: prod.price || 0,
          compareAtPrice: prod.compareAtPrice || 0,
          stock: prod.stock || 0,
          category: (prod.category as ProductCategory) || "electronics",
          images: prod.images || [],
          status: prod.status || "draft",
          isFeatured: prod.isFeatured || false,
          specifications:
            prod.specifications?.length
              ? prod.specifications
              : [{ label: "", value: "" }],
          faqs:
            prod.faqs?.length
              ? prod.faqs
              : [{ question: "", answer: "" }],
        });
      } catch {
        toast.error("Failed to load product documentation profile");
        navigate("/seller/products");
      } finally {
        setIsLoadingProduct(false);
      }
    }

    void loadProduct();
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (values: ProductFormValues & { slug?: string }) => {
    try {
      // Deconstruct the slug so it isn't forwarded blindly to standard API engines if unsupported
      const { slug, ...payload } = values;

      if (isEditMode && id) {
        await updateProduct(id, payload);
        toast.success("Product configurations updated successfully");
      } else {
        await createProduct(payload);
        toast.success("Product listing created successfully");
      }

      navigate("/seller/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product registry item");
    }
  };

  // Modern Loading Fallback consistent with your app's theme
  if (isEditMode && isLoadingProduct && !initialValues) {
    return (
      <div className="min-h-screen bg-[#09090B] px-4 py-6 text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-[#DB4444]" />
        <p className="text-sm font-medium tracking-wide text-zinc-400">Loading catalog profile parameters...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <ProductForm
        mode={isEditMode ? "edit" : "create"}
        initialValues={initialValues ?? initialFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/seller/products")}
      />
    </div>
  );
}