import { Types } from "mongoose";
import { Shipment } from "./shipment.model";
import type { CreateShipmentInput, ShipmentStatus } from "./shipment.types";
import { Order } from "../orders/order.model";

export async function createShipment(payload: CreateShipmentInput) {
  const order = await Order.findById(payload.orderId);
  if (!order) {
    const error = new Error("Order not found") as any;
    error.statusCode = 404;
    throw error;
  }

  const existingShipment = await Shipment.findOne({ order: payload.orderId });
  if (existingShipment) {
    const error = new Error("Shipment already exists for this order") as any;
    error.statusCode = 409;
    throw error;
  }

  const shipment = await Shipment.create({
    order: new Types.ObjectId(payload.orderId),
    carrier: payload.carrier,
    trackingNumber: payload.trackingNumber,
    eta: payload.eta,
    status: payload.status || "pending",
  });

  return shipment;
}

export async function getShipments() {
  return Shipment.find()
    .populate({
      path: "order",
      select: "items shippingAddress status total createdAt updatedAt",
    })
    .sort({ createdAt: -1 });
}

export async function getShipmentById(id: string) {
  return Shipment.findById(id).populate({
    path: "order",
    select: "items shippingAddress status total createdAt updatedAt",
  });
}

export async function updateShipmentStatus(id: string, status: ShipmentStatus) {
  const shipment = await Shipment.findById(id);
  if (!shipment) {
    const error = new Error("Shipment not found") as any;
    error.statusCode = 404;
    throw error;
  }

  shipment.status = status;
  await shipment.save();

  return shipment;
}