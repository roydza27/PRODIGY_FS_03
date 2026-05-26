import type { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { wishlistService } from "./wishlist.service";

function sendWishlistResponse(
  res: Response,
  userId: string,
  wishlist: unknown[],
  message?: string,
  status = 200
) {
  return res.status(status).json({
    success: true,
    ...(message ? { message } : {}),
    data: {
      userId,
      wishlist,
    },
  });
}

export const handleGetWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const wishlist = await wishlistService.getWishlist(req.user.userId);

    return sendWishlistResponse(res, req.user.userId, wishlist);
  } catch (error) {
    next(error);
  }
};

export const handleAddToWishlist = async (
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { productId } = req.params;
    const wishlist = await wishlistService.addToWishlist(
      req.user.userId,
      productId
    );

    return sendWishlistResponse(
      res,
      req.user.userId,
      wishlist,
      "Product added to wishlist"
    );
  } catch (error) {
    next(error);
  }
};

export const handleRemoveFromWishlist = async (
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { productId } = req.params;
    const wishlist = await wishlistService.removeFromWishlist(
      req.user.userId,
      productId
    );

    return sendWishlistResponse(
      res,
      req.user.userId,
      wishlist,
      "Product removed from wishlist"
    );
  } catch (error) {
    next(error);
  }
};

export const handleClearWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const wishlist = await wishlistService.clearWishlist(req.user.userId);

    return sendWishlistResponse(
      res,
      req.user.userId,
      wishlist,
      "Wishlist cleared"
    );
  } catch (error) {
    next(error);
  }
};