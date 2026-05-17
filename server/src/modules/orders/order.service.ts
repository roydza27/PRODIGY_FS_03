import { Types } from "mongoose";
import { Order } from "./order.model";
import type { CreateOrderInput } from "./order.types";
import { Cart } from "../cart/cart.model";
import { Product } from "../product/product.model";
import {AppError} from "@/utils/AppError"

function getProductId(item: any): string {
  if (!item?.product) return "";
  return typeof item.product === "object" ? String(item.product._id) : String(item.product);
}

export async function createOrder(userId: string, payload: CreateOrderInput) {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || !cart.items.length) {
    throw new AppError("Cart is empty", 400);
  }

  const items = cart.items.map((item: any) => {
    const product = item.product;
    return {
      productId: String(product._id),
      name: product.name,
      image: product.images?.[0],
      price: product.price,
      quantity: item.quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`Product not found: ${item.name}`);
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.name}`);
    }
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: new Types.ObjectId(userId),
    items,
    shippingAddress: payload.shippingAddress,
    paymentMethod: payload.paymentMethod,
    status: "pending",
    subtotal,
    total: subtotal,
  });

  cart.set("items", []);
  await cart.save();

  return order;
}

export async function getOrdersByUser(userId: string) {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
}

export async function getOrderById(orderId: string) {
  return Order.findById(orderId);
}

export async function updateOrderStatus(orderId: string, status: string) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  order.status = status as any;
  await order.save();

  return order;
}