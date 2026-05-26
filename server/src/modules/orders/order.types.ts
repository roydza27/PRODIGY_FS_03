export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "card";

export interface OrderItemSnapshot {
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

export interface CreateOrderInput {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

export interface OrderShipmentSummary {
  _id: string;
  carrier: string;
  trackingNumber: string;
  eta: string;
  status: "pending" | "packed" | "in_transit" | "delivered" | "cancelled";
}

export interface AdminOrderItemSnapshot {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface AdminShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AdminOrder {
  _id: string;
  items: AdminOrderItemSnapshot[];
  shippingAddress: AdminShippingAddress;
  paymentMethod: "cod" | "card";
  status: OrderStatus;
  subtotal: number;
  total: number;
  shipment?: OrderShipmentSummary | null;
  createdAt: string;
  updatedAt: string;
}