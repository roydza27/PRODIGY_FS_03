export type ShipmentStatus =
  | "pending"
  | "packed"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface CreateShipmentInput {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  eta: string;
  status?: ShipmentStatus;
}

export interface UpdateShipmentStatusInput {
  status: ShipmentStatus;
}