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

export type SpecificationItem = {
  label: string;
  value: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

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
  sellerId?: string;
  specifications?: SpecificationItem[];
  faqs?: FAQItem[];
}