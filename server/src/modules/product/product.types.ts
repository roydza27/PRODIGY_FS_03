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
  sellerId?: string;
}

export interface SpecificationItem {
  label: string;
  value: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProductReviewItem {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  order: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductReviewState {
  canReview: boolean;
}

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

  colors?: ProductColor[];
  warranty?: string;

  sizes?: string[];
  material?: string;

  author?: string;
  publisher?: string;
  pages?: number;
}

export interface ProductColor {
  id: string;
  hex: string;
  label?: string;
}

export interface ProductBase {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  stock: number;
  brand?: string;
  rating: number;
  reviewCount: number;
  images: string[];
  isFeatured: boolean;
  status: ProductStatus;
  sellerId?: string;

  specifications: SpecificationItem[];
  faqs: FAQItem[];
  reviews: ProductReviewItem[];

  canReview?: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ElectronicsProduct extends ProductBase {
  category: "electronics";
  colors?: ProductColor[];
  warranty?: string;
}

export interface FashionProduct extends ProductBase {
  category: "fashion";
  colors?: ProductColor[];
  sizes?: string[];
  material?: string;
}

export interface BookProduct extends ProductBase {
  category: "books";
  author?: string;
  publisher?: string;
  pages?: number;
}

export interface GenericProduct extends ProductBase {
  category: "home" | "groceries" | "beauty" | "sports" | "toys" | "other";
}

export type Product =
  | ElectronicsProduct
  | FashionProduct
  | BookProduct
  | GenericProduct;

export interface ProductsResponse {
  success: boolean;
  message?: string;
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductResponse {
  success: boolean;
  message?: string;
  product: Product;
}