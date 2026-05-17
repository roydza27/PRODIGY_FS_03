import { Request, Response, NextFunction } from "express";
import {
  addItemToCart,
  clearCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "./cart.service";

type AuthedRequest = Request & {
  user?: {
    userId?: string;
    email?: string;
    role?: string;
  };
};

function getUserId(req: AuthedRequest) {
  return req.user?.userId;
}

export async function handleGetCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = getUserId(req as AuthedRequest);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const cart = await fetchCart(userId);

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleAddItemToCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = getUserId(req as AuthedRequest);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const { productId, quantity } = req.body as {
      productId: string;
      quantity: number;
    };

    const result = await addItemToCart(userId, productId, quantity);

    if (result && "error" in result) {
      res.status(result.statusCode).json({
        success: false,
        message: result.error,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      cart: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateCartItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = getUserId(req as AuthedRequest);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const productId = String(req.params.productId);
    const { quantity } = req.body as { quantity: number };

    const result = await updateCartItem(userId, productId, quantity);

    if (result && "error" in result) {
      res.status(result.statusCode).json({
        success: false,
        message: result.error,
      });
      return;
    }

    res.json({
      success: true,
      message: "Cart item updated successfully",
      cart: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleRemoveCartItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = getUserId(req as AuthedRequest);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const productId = String(req.params.productId);
    const result = await removeCartItem(userId, productId);

    if (result && "error" in result) {
      res.status(result.statusCode).json({
        success: false,
        message: result.error,
      });
      return;
    }

    res.json({
      success: true,
      message: "Item removed from cart successfully",
      cart: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleClearCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = getUserId(req as AuthedRequest);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const result = await clearCart(userId);

    if (result && "error" in result) {
      res.status(result.statusCode).json({
        success: false,
        message: result.error,
      });
      return;
    }

    res.json({
      success: true,
      message: "Cart cleared successfully",
      cart: result,
    });
  } catch (error) {
    next(error);
  }
}