import mongoose from "mongoose";
import { User } from "@/modules/auth/auth.model";
import { Product } from "@/modules/product/product.model";
import { AppError } from "@/utils/AppError";

async function getPopulatedWishlist(userId: string) {
  const user = await User.findById(userId).populate("wishlist");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user.wishlist || [];
}

function validateProductId(productId: string) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Invalid product ID", 400);
  }
}

export const wishlistService = {
  async getWishlist(userId: string) {
    return getPopulatedWishlist(userId);
  },

  async addToWishlist(userId: string, productId: string) {
    validateProductId(productId);

    const [user, product] = await Promise.all([
      User.findById(userId),
      Product.findById(productId),
    ]);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const existingIds = (user.wishlist || []).map((item: mongoose.Types.ObjectId) =>
      item.toString()
    );

    if (!existingIds.includes(productId)) {
      user.wishlist = [...existingIds, product._id] as any;
      await user.save();
    }

    return getPopulatedWishlist(userId);
  },

  async removeFromWishlist(userId: string, productId: string) {
    validateProductId(productId);

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.wishlist = (user.wishlist || []).filter(
      (item: mongoose.Types.ObjectId) => item.toString() !== productId
    ) as any;

    await user.save();

    return getPopulatedWishlist(userId);
  },

  async clearWishlist(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.wishlist = [] as any;
    await user.save();

    return getPopulatedWishlist(userId);
  },
};