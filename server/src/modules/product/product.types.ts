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