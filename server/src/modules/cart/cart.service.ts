import { Cart } from "./cart.model";
import { Product } from "../product/product.model";

type CartWithPopulatedItems = any;

function computeCartTotals(cart: CartWithPopulatedItems) {
  const items = cart.items ?? [];

  const itemCount = items.reduce(
    (sum: number, item: any) => sum + (item.quantity ?? 0),
    0
  );

  const subtotal = items.reduce((sum: number, item: any) => {
    const price = item.product?.price ?? 0;
    return sum + price * (item.quantity ?? 0);
  }, 0);

  return {
    ...cart.toObject(),
    itemCount,
    subtotal,
  };
}

function getProductId(item: any) {
  return item.product?._id?.toString?.() ?? item.product?.toString?.();
}

async function getOrCreateCart(userId: string) {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate("items.product");
  }

  return cart;
}

export async function fetchCart(userId: string) {
  const cart = await getOrCreateCart(userId);
  return cart ? computeCartTotals(cart) : null;
}

export async function addItemToCart(
  userId: string,
  productId: string,
  quantity: number
) {
  const product = await Product.findById(productId);

  if (!product) {
    return { error: "Product not found", statusCode: 404 };
  }

  if (product.status !== "active") {
    return { error: "Product is not available", statusCode: 400 };
  }

  const cart = await getOrCreateCart(userId);

  if (!cart) {
    return { error: "Cart not found", statusCode: 404 };
  }

  const existingItem = cart.items.find(
    (item: any) => getProductId(item) === productId
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      quantity,
    } as any);
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  return populatedCart ? computeCartTotals(populatedCart) : null;
}

export async function updateCartItem(
  userId: string,
  productId: string,
  quantity: number
) {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    return { error: "Cart not found", statusCode: 404 };
  }

  const item = cart.items.find(
    (entry: any) => entry.product._id.toString() === productId
  );

  if (!item) {
    return { error: "Cart item not found", statusCode: 404 };
  }

  item.quantity = quantity;

  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  return populatedCart ? computeCartTotals(populatedCart) : null;
}

export async function removeCartItem(userId: string, productId: string) {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    return { error: "Cart not found", statusCode: 404 };
  }

  const initialLength = cart.items.length;

  const filteredItems = cart.items.filter(
    (item: any) => item.product._id.toString() !== productId
  );

  if (filteredItems.length === initialLength) {
    return { error: "Cart item not found", statusCode: 404 };
  }

  cart.set("items", filteredItems);
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  return populatedCart ? computeCartTotals(populatedCart) : null;
}

export async function clearCart(userId: string) {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return { error: "Cart not found", statusCode: 404 };
  }

  cart.set("items", []);
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  return populatedCart ? computeCartTotals(populatedCart) : null;
}