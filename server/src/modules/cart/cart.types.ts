export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface CartUpdateInput {
  quantity: number;
}

export interface PopulatedProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock: number;
  status: "draft" | "active" | "archived";
}

export interface CartItemResponse {
  product: PopulatedProduct;
  quantity: number;
}

export interface CartResponse {
  _id: string;
  user: string;
  items: CartItemResponse[];
  subtotal: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}