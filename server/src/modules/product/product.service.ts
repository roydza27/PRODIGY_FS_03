import { Product } from "./product.model";
import { ProductInput, ProductQuery } from "./product.types";
import { Types } from "mongoose";

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
    Product.find(filter).sort(sort).skip(skip).limit(limitNum).populate("sellerId", "name shopName"),
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

export async function updateProduct(id: string, payload: ProductInput) {
  return Product.findByIdAndUpdate(id, payload, { new: true }).populate("sellerId", "name shopName");
}

export async function deleteProduct(id: string) {
  return Product.findByIdAndDelete(id);
}

/**
 * Get products by a specific seller
 * @param sellerId - The ID of the seller
 * @param query - Query parameters (search, category, status, etc.)
 */
export async function getProductsBySeller(sellerId: string, query: ProductQuery) {
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
 * @param productId - The ID of the product
 * @param userId - The ID of the user attempting to modify
 * @returns The product if ownership is verified, null otherwise
 */
export async function verifyProductOwnership(productId: string, userId: string) {
  return Product.findOne({
    _id: productId,
    sellerId: userId,
  });
}

/**
 * Update seller's product with ownership check
 * @param productId - The ID of the product to update
 * @param sellerId - The ID of the seller attempting to update
 * @param payload - The update payload
 */
export async function updateSellerProduct(productId: string, sellerId: string, payload: ProductInput) {
  const product = await verifyProductOwnership(productId, sellerId);
  if (!product) {
    throw new Error("Product not found or not owned by this seller");
  }
  return Product.findByIdAndUpdate(productId, payload, { new: true });
}

/**
 * Delete seller's product with ownership check
 * @param productId - The ID of the product to delete
 * @param sellerId - The ID of the seller attempting to delete
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
 * @param sellerId - The ID of the seller
 */
export async function getSellerProductStats(sellerId: string) {
  const [totalProducts, activeProducts, draftProducts, archivedProducts] = await Promise.all([
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