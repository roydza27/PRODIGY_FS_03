import type { Request, Response, NextFunction } from "express";
import { createOrderSchema, updateOrderStatusSchema } from "./order.validation";
import { createOrder, getOrderById, getOrdersByUser, updateOrderStatus } from "./order.service";

export async function createOrderController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createOrderSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const order = await createOrder(userId, parsed);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
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

export async function getOrderByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await getOrderById(req.params.id);
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
    const order = await updateOrderStatus(req.params.id, parsed.status);

    return res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    next(error);
  }
}