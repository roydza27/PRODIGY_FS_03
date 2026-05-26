import { z } from "zod";

export const createShipmentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  carrier: z.string().min(2, "Carrier is required"),
  trackingNumber: z.string().min(3, "Tracking number is required"),
  eta: z.string().min(2, "ETA is required"),
  status: z.enum(["pending", "packed", "in_transit", "delivered", "cancelled"]).optional(),
});

export const updateShipmentSchema = z.object({
  carrier: z.string().min(2).optional(),
  trackingNumber: z.string().min(3).optional(),
  eta: z.string().min(2).optional(),
  status: z.enum(["pending", "packed", "in_transit", "delivered", "cancelled"]).optional(),
});

export const updateShipmentStatusSchema = z.object({
  status: z.enum(["pending", "packed", "in_transit", "delivered", "cancelled"]),
});