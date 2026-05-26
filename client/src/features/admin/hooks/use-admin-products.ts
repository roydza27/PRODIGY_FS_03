import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "@/features/products/types/product.types";
import { adminProductService } from "../services/product.service";

export interface AdminProductStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  archivedProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

interface UseAdminProductsResult {
  products: Product[];
  stats: AdminProductStats;
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  getProduct: (productId: string) => Promise<Product>;
  createProduct: (payload: Partial<Product>) => Promise<Product>;
  updateProduct: (productId: string, payload: Partial<Product>) => Promise<Product>;
  deleteProduct: (productId: string) => Promise<void>;
}

function buildStats(products: Product[]): AdminProductStats {
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const draftProducts = products.filter((p) => p.status === "draft").length;
  const archivedProducts = products.filter((p) => p.status === "archived").length;
  const lowStockProducts = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5).length;
  const outOfStockProducts = products.filter((p) => (p.stock ?? 0) <= 0).length;

  return {
    totalProducts,
    activeProducts,
    draftProducts,
    archivedProducts,
    lowStockProducts,
    outOfStockProducts,
  };
}

/**
 * Hook for managing admin products
 */
export function useAdminProducts(): UseAdminProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => buildStats(products), [products]);

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminProductService.getAll();
      setProducts(response.items || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch products";
      setError(message);
      console.error("Error fetching admin products:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (productId: string): Promise<Product> => {
    try {
      const response = await adminProductService.getById(productId);
      return response.product;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch product";
      throw new Error(message);
    }
  }, []);

  const createProduct = useCallback(async (payload: Partial<Product>): Promise<Product> => {
    try {
      const response = await adminProductService.create(payload);
      setProducts((prev) => [response.product, ...prev]);
      return response.product;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create product";
      throw new Error(message);
    }
  }, []);

  const updateProduct = useCallback(
    async (productId: string, payload: Partial<Product>): Promise<Product> => {
      try {
        const response = await adminProductService.update(productId, payload);
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? response.product : p))
        );
        return response.product;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update product";
        throw new Error(message);
      }
    },
    []
  );

  const deleteProduct = useCallback(async (productId: string): Promise<void> => {
    try {
      await adminProductService.remove(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete product";
      throw new Error(message);
    }
  }, []);

  useEffect(() => {
    void refreshProducts();
  }, [refreshProducts]);

  return {
    products,
    stats,
    isLoading,
    error,
    refreshProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}