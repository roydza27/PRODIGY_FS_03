import { Types } from "mongoose";

import { AppError } from "@/utils/AppError";
import { Order } from "../orders/order.model";
import { Product } from "./product.model";
import type { ProductInput, ProductQuery } from "./product.types";

export async function createProduct(payload: ProductInput) {
  return Product.create(payload);
}

export async function getProducts(query: ProductQuery) {
  const {
    search,
    category,
    featured,
    status,
    sellerId,
    sort = "-createdAt",
    page = "1",
    limit = "10",
  } = query;

  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (featured === "true") filter.isFeatured = true;
  if (featured === "false") filter.isFeatured = false;
  if (sellerId) filter.sellerId = sellerId;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.max(Number(limit) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate("sellerId", "name shopName"),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
}

export async function getProductById(id: string) {
  return Product.findById(id).populate("sellerId", "name shopName");
}

export async function updateProduct(id: string, payload: Partial<ProductInput>) {
  return Product.findByIdAndUpdate(id, payload, { new: true }).populate(
    "sellerId",
    "name shopName"
  );
}

export async function deleteProduct(id: string) {
  return Product.findByIdAndDelete(id);
}

/**
 * Get products by a specific seller
 */
export async function getProductsBySeller(
  sellerId: string,
  query: ProductQuery
) {
  const { search, category, status, sort = "-createdAt", page = "1", limit = "10" } = query;

  const filter: Record<string, any> = { sellerId };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) filter.category = category;
  if (status) filter.status = status;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.max(Number(limit) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
}

/**
 * Verify product ownership before allowing updates/deletes
 */
export async function verifyProductOwnership(productId: string, userId: string) {
  return Product.findOne({
    _id: productId,
    sellerId: userId,
  });
}

/**
 * Update seller's product with ownership check
 */
export async function updateSellerProduct(
  productId: string,
  sellerId: string,
  payload: ProductInput
) {
  const product = await verifyProductOwnership(productId, sellerId);
  if (!product) {
    throw new Error("Product not found or not owned by this seller");
  }
  return Product.findByIdAndUpdate(productId, payload, { new: true });
}

/**
 * Delete seller's product with ownership check
 */
export async function deleteSellerProduct(productId: string, sellerId: string) {
  const product = await verifyProductOwnership(productId, sellerId);
  if (!product) {
    throw new Error("Product not found or not owned by this seller");
  }
  return Product.findByIdAndDelete(productId);
}

/**
 * Get seller product statistics
 */
export async function getSellerProductStats(sellerId: string) {
  const [totalProducts, activeProducts, draftProducts, archivedProducts] =
    await Promise.all([
      Product.countDocuments({ sellerId }),
      Product.countDocuments({ sellerId, status: "active" }),
      Product.countDocuments({ sellerId, status: "draft" }),
      Product.countDocuments({ sellerId, status: "archived" }),
    ]);

  const totalStockResult = await Product.aggregate([
    { $match: { sellerId: new Types.ObjectId(sellerId) } },
    { $group: { _id: null, total: { $sum: "$stock" } } },
  ]);

  const avgRatingResult = await Product.aggregate([
    { $match: { sellerId: new Types.ObjectId(sellerId), rating: { $gt: 0 } } },
    { $group: { _id: null, avg: { $avg: "$rating" } } },
  ]);

  return {
    totalProducts,
    activeProducts,
    draftProducts,
    archivedProducts,
    totalStock: totalStockResult[0]?.total || 0,
    averageRating: avgRatingResult[0]?.avg || 0,
  };
}

async function getDeliveredOrderForProduct(productId: string, userId: string) {
  return Order.findOne({
    user: userId,
    status: "delivered",
    "items.productId": productId,
  });
}

export async function canUserReviewProduct(productId: string, userId: string) {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const purchased = await getDeliveredOrderForProduct(productId, userId);
  if (!purchased) return false;

  const reviews = product.reviews ?? [];
  const alreadyReviewed = reviews.some(
    (review: any) => String(review.user) === String(userId)
  );

  return !alreadyReviewed;
}

type AddReviewInput = {
  rating: number;
  comment: string;
};

export async function addProductReview(
  productId: string,
  userId: string,
  payload: AddReviewInput
) {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const purchased = await getDeliveredOrderForProduct(productId, userId);
  if (!purchased) {
    throw new AppError(
      "Only customers who purchased this product can review it",
      403
    );
  }

  const reviews = product.reviews ?? [];
  const alreadyReviewed = reviews.some(
    (review: any) => String(review.user) === String(userId)
  );

  if (alreadyReviewed) {
    throw new AppError("You already reviewed this product", 400);
  }

  reviews.push({
    user: new Types.ObjectId(userId),
    order: purchased._id,
    rating: payload.rating,
    comment: payload.comment,
    createdAt: new Date(),
  } as any);

  product.reviews = reviews;
  product.reviewCount = reviews.length;
  product.rating =
    reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
    reviews.length;

  await product.save();

  return Product.findById(productId).populate("reviews.user", "name");
}

export async function getProductReviews(productId: string) {
  const product = await Product.findById(productId).populate(
    "reviews.user",
    "name"
  );

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product.reviews ?? [];
}