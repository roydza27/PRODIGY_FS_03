export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "card";

export interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
}

export interface OrderResponse {
  success: boolean;
  order: Order;
}