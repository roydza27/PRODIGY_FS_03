import type { ProductsResponse } from "@/features/products/types/product.types";
import api from "@/services/api";

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

export interface ProductInput {
  name: string;
  slug?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  category: ProductCategory;
  images: string[];
  isFeatured?: boolean;
  status?: ProductStatus;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  featured?: string;
  status?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

export interface SellerProductStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  archivedProducts: number;
  totalStock: number;
  averageRating: number;
}

/**
 * Seller product API service
 * Handles all seller-specific product operations
 */
export const sellerProductService = {
  /**
   * Create a new product as a seller
   */
  async createProduct(payload: ProductInput) {
    return api.post(`/seller/products`, payload);
  },

  /**
   * Get all products for the current seller
   */
  async getSellerProducts(query?: ProductQuery) {
    return api.get<ProductsResponse>(`/seller/products`, { params: query });
  },

  /**
   * Get product statistics for the current seller
   */
  async getSellerProductStats() {
    return api.get<{ success: boolean; stats: SellerProductStats }>(
      `/seller/products/stats`
    );
  },

  /**
   * Update a seller's product
   */
  async updateProduct(productId: string, payload: Partial<ProductInput>) {
    return api.patch(`/seller/products/${productId}`, payload);
  },

  /**
   * Delete a seller's product
   */
  async deleteProduct(productId: string) {
    return api.delete(`/seller/products/${productId}`);
  },

  /**
   * Get a specific product by ID (for editing)
   */
  async getProduct(productId: string) {
    return api.get(`/products/${productId}`);
  },
};
