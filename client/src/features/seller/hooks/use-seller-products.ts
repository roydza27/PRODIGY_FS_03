import { useState, useEffect } from "react";
import type { ProductInput, SellerProductStats } from "../services/seller-product.service";
import { sellerProductService } from "../services/seller-product.service";
import type { Product } from "@/features/products/types/product.types";

interface UseSellerProductsResult {
  products: Product[];
  stats: SellerProductStats | null;
  isLoading: boolean;
  error: string | null;
  refreshProducts: (page?: number, limit?: number) => Promise<void>;
  createProduct: (payload: ProductInput) => Promise<Product>;
  updateProduct: (productId: string, payload: Partial<ProductInput>) => Promise<Product>;
  deleteProduct: (productId: string) => Promise<void>;
}

/**
 * Hook for managing seller products
 */
export function useSellerProducts(): UseSellerProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<SellerProductStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products
  const refreshProducts = async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await sellerProductService.getSellerProducts({
        page: String(page),
        limit: String(limit),
      });
      setProducts(response.data.items);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch products";
      setError(message);
      console.error("Error fetching seller products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await sellerProductService.getSellerProductStats();
      setStats(response.data.stats);
    } catch (err) {
      console.error("Error fetching seller product stats:", err);
    }
  };

  // Create product
  const createProduct = async (payload: ProductInput): Promise<Product> => {
    try {
      const response = await sellerProductService.createProduct(payload);
      setProducts((prev) => [response.data.product, ...prev]);
      // Refresh stats after creating a product
      fetchStats();
      return response.data.product;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create product";
      throw new Error(message);
    }
  };

  // Update product
  const updateProduct = async (
    productId: string,
    payload: Partial<ProductInput>
  ): Promise<Product> => {
    try {
      const response = await sellerProductService.updateProduct(productId, payload);
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? response.data.product : p))
      );
      return response.data.product;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update product";
      throw new Error(message);
    }
  };

  // Delete product
  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      await sellerProductService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      // Refresh stats after deleting a product
      fetchStats();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete product";
      throw new Error(message);
    }
  };

  // Initial load
  useEffect(() => {
    refreshProducts();
    fetchStats();
  }, []);

  return {
    products,
    stats,
    isLoading,
    error,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
