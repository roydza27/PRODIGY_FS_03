import { Schema, model, Types } from "mongoose";

export type ShipmentStatus =
  | "pending"
  | "packed"
  | "in_transit"
  | "delivered"
  | "cancelled";

interface ShipmentDocument {
  order: Types.ObjectId;
  carrier: string;
  trackingNumber: string;
  eta: string;
  status: ShipmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const shipmentSchema = new Schema<ShipmentDocument>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true,
    },
    carrier: { type: String, required: true, trim: true },
    trackingNumber: { type: String, required: true, trim: true },
    eta: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "packed", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Shipment = model<ShipmentDocument>("Shipment", shipmentSchema);