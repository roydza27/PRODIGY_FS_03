"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ProductForm, {
  type ProductFormValues,
} from "@/features/products/components/ProductForm";
import { useAdminProducts } from "../hooks/use-admin-products";
import type { ProductCategory } from "@/features/products/components/ProductForm";

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

export default function AdminProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Declared string type parameter check
  const { getProduct, createProduct, updateProduct } = useAdminProducts();

  const isEditMode = Boolean(id);
  const [initialValues, setInitialValues] = useState<ProductFormValues | null>(
    isEditMode ? null : initialFormData
  );
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode || !id) return;

    async function loadProduct() {
      try {
        setIsLoadingProduct(true);
        const prod = await getProduct(id);


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
          specifications: prod.specifications || [],
          faqs: prod.faqs || [],
        });
      } catch {
        toast.error("Failed to load historical product parameters");
        navigate("/admin/products");
      } finally {
        setIsLoadingProduct(false);
      }
    }

    void loadProduct();
  }, [id, isEditMode, getProduct, navigate]);

  const handleSubmit = async (values: ProductFormValues & { slug: string }) => {
    try {
      if (isEditMode && id) {
        await updateProduct(id, values);
        toast.success("Product configurations updated successfully");
      } else {
        await createProduct(values);
        toast.success("New product introduced successfully");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to commit product changes");
    }
  };

  if (isEditMode && isLoadingProduct && !initialValues) {
    return (
      <div className="min-h-screen bg-[#09090B] px-4 py-6 text-white flex items-center justify-center">
        <p className="text-zinc-400 font-medium">Loading catalog specifications configuration data...</p>
      </div>
    );
  }

  return (
    <ProductForm
      mode={isEditMode ? "edit" : "create"}
      initialValues={initialValues ?? initialFormData}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/products")}
    />
  );
}