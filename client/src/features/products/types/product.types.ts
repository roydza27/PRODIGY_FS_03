export type ProductImage = string;

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

interface ProductColor {
  id: string;
  hex: string;
  label?: string;
}

export type SpecificationItem = {
  label: string;
  value: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export interface ProductBase {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  stock?: number;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  images?: ProductImage[];
  isFeatured?: boolean;
  status?: ProductStatus;
  specifications?: SpecificationItem[];
  faqs?: FAQItem[];
  createdAt?: string;
  updatedAt?: string;
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

export type Product =
  | ElectronicsProduct
  | FashionProduct
  | BookProduct
  | ProductBase;

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

