import type { Request, Response, NextFunction } from "express";
import { createOrderSchema, updateOrderStatusSchema } from "./order.validation";
import {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
} from "./order.service";

export async function createOrderController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createOrderSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await createOrder(userId, parsed);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: result.order,
      shipment: result.shipment,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrdersController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const orders = await getOrdersByUser(userId);

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrdersController(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await getAllOrders();

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    // FIXED: Cast params.id to string to satisfy strict Express types
    const orderId = req.params.id as string;
    const order = await getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const userId = req.user?.userId;
    const role = req.user?.role;

    if (role !== "admin" && String(order.user) !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatusController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateOrderStatusSchema.parse(req.body);
    // FIXED: Cast params.id to string to satisfy strict Express types
    const orderId = req.params.id as string;
    
    const order = await updateOrderStatus(orderId, parsed.status);

    return res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    next(error);
  }
}

export const cancelOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.id as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // FIXED: Used your internal service function instead of raw Mongoose Order model
    const order = await getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // FIXED: Security Check checking against req.user?.userId instead of undefined req.user._id
    if (String(order.user) !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this order" });
    }

    // Business Logic Check: Only allow cancellation if it hasn't shipped
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel an order that is already ${order.status}` });
    }

    // FIXED: Used your internal update service to maintain consistent logic architecture
    await updateOrderStatus(orderId, "cancelled");

    return res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    // FIXED: Switched to next(error) to keep standard Express error handling consistent
    next(error);
  }
};