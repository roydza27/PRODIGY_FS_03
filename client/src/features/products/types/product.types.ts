export type ProductImage = string;

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category?: string;
  stock?: number;
  brand?: string;
  rating?: number;
  images?: ProductImage[];
  isFeatured?: boolean;
  status?: "draft" | "active" | "archived";
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  success: boolean;
  message?: string;
  items: Product[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface ProductResponse {
  success: boolean;
  message?: string;
  product: Product;
}