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
  sellerId?: string; // Optional - auto-assigned from request user for sellers
}

export interface ProductQuery {
  search?: string;
  category?: string;
  featured?: string;
  status?: string;
  sort?: string;
  page?: string;
  limit?: string;
  sellerId?: string; // Filter products by seller
}