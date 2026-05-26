import mongoose from "mongoose";
import { User } from "@/modules/auth/auth.model";
import { Product } from "@/modules/product/product.model";
import { AppError } from "@/utils/AppError";
import type {
  SellerApplicationRequest,
  SellerApprovalRequest,
  SellerStats,
  SellerDashboardData,
} from "./seller.types";

export const sellerService = {
  // Apply to become a seller
  async applyForSeller(
    userId: string,
    applicationData: SellerApplicationRequest
  ) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role !== "user") {
      throw new AppError("Only regular users can apply to become sellers", 400);
    }

    if (user.sellerStatus !== "none") {
      throw new AppError(
        `Cannot apply. Current status: ${user.sellerStatus}`,
        400
      );
    }

    // Update user with seller application data
    user.sellerStatus = "applied";
    user.sellerAppliedAt = new Date();
    user.sellerInfo = applicationData;

    await user.save();

    return {
      message: "Seller application submitted successfully",
      data: {
        userId: user._id,
        sellerStatus: user.sellerStatus,
      },
    };
  },

  // Admin: Get all seller applications
  async getAllApplications() {
    const users = await User.find({
      sellerStatus: { $in: ["applied", "approved", "rejected", "suspended"] },
    }).select("name email sellerInfo sellerStatus sellerAppliedAt sellerApprovedAt");

    return users;
  },

  // Admin: Get single seller application
  async getApplicationById(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.sellerStatus === "none") {
      throw new AppError("User has not applied to become a seller", 400);
    }

    return user;
  },

  // Admin: Approve seller application
  async approveSeller(
    userId: string,
    adminId: string
  ) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.sellerStatus !== "applied") {
      throw new AppError("Application is not in applied status", 400);
    }

    // Update seller status
    user.role = "seller";
    user.sellerStatus = "approved";
    user.sellerApprovedAt = new Date();

    await user.save();

    return {
      message: "Seller application approved successfully",
      data: {
        userId: user._id,
        role: user.role,
        sellerStatus: user.sellerStatus,
      },
    };
  },

  // Admin: Reject seller application
  async rejectSeller(
    userId: string,
    rejectionReason: string
  ) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.sellerStatus !== "applied") {
      throw new AppError("Application is not in applied status", 400);
    }

    user.sellerStatus = "rejected";
    user.sellerRejectedAt = new Date();
    user.sellerRejectionReason = rejectionReason;

    await user.save();

    return {
      message: "Seller application rejected",
      data: {
        userId: user._id,
        sellerStatus: user.sellerStatus,
      },
    };
  },

  // Seller: Get dashboard data
  async getSellerDashboard(userId: string): Promise<SellerDashboardData> {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role !== "seller") {
      throw new AppError("User is not a seller", 403);
    }

    // Get seller stats
    const stats = await this.getSellerStats(userId);

    return {
      seller: {
        name: user.name,
        email: user.email,
        shopName: user.sellerInfo?.shopName || "",
        shopDescription: user.sellerInfo?.shopDescription || "",
        sellerStatus: user.sellerStatus,
      },
      stats,
    };
  },

  // Get seller stats (products, orders, revenue, etc.)
  async getSellerStats(sellerId: string): Promise<SellerStats> {
    const [totalProducts, totalReviews] = await Promise.all([
      Product.countDocuments({ sellerId, status: "active" }),
      Product.aggregate([
        // FIX: Added 'new mongoose' here instead of inline require
        { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
        { $group: { _id: null, total: { $sum: "$reviewCount" } } },
      ]),
    ]);

    const totalReviewsCount = totalReviews[0]?.total || 0;
    const avgRating = await Product.aggregate([
      // FIX: Added 'new mongoose' here as well
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    return {
      totalProducts,
      totalOrders: 0, // Will be updated when order module is enhanced
      totalRevenue: 0, // Will be updated when order module is enhanced
      averageRating: avgRating[0]?.avgRating || 0,
      totalReviews: totalReviewsCount,
    };
  },

  // Get seller profile for public view
  async getSellerProfile(userId: string) {
    const user = await User.findById(userId);

    if (!user || user.role !== "seller" || user.sellerStatus !== "approved") {
      throw new AppError("Seller not found", 404);
    }

    const stats = await this.getSellerStats(userId);

    return {
      id: user._id,
      name: user.name,
      shopName: user.sellerInfo?.shopName || "",
      shopDescription: user.sellerInfo?.shopDescription || "",
      coverImage: user.sellerInfo?.coverImage,
      profileImage: user.sellerInfo?.profileImage,
      stats,
      joinedAt: user.createdAt,
    };
  },

  async getCurrentUserApplicationStatus(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.sellerStatus === "none") {
      return null;
    }

    return user;
  }
};
