import mongoose from "mongoose";
// FIXED: Removed the bad import `import User from "./seller.model"`
// FIXED: Using your correct central User model import
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
        { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
        { $group: { _id: null, total: { $sum: "$reviewCount" } } },
      ]),
    ]);

    const totalReviewsCount = totalReviews[0]?.total || 0;
    const avgRating = await Product.aggregate([
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
  },

  // FIXED: Added the update settings method logic mapped back to your User Schema
  async updateSellerSettings(userId: string, updateData: any) {
    const user = await User.findById(userId);
    
    if (!user || user.role !== "seller") {
      throw new AppError("Seller not found or unauthorized", 404);
    }

    // Because seller details live nested inside 'sellerInfo' in your schema,
    // we carefully map incoming payload fields to prevent overwriting other User properties.
    const fieldsToUpdate: Record<string, any> = {};

    // Destructure profile data
    if (updateData.shopName) fieldsToUpdate["sellerInfo.shopName"] = updateData.shopName;
    if (updateData.shopDescription) fieldsToUpdate["sellerInfo.shopDescription"] = updateData.shopDescription;
    
    // Destructure bank data
    if (updateData.bankDetails) {
      if (updateData.bankDetails.accountName) fieldsToUpdate["sellerInfo.bankAccountName"] = updateData.bankDetails.accountName;
      if (updateData.bankDetails.accountNumber) fieldsToUpdate["sellerInfo.bankAccountNumber"] = updateData.bankDetails.accountNumber;
      if (updateData.bankDetails.ifsc) fieldsToUpdate["sellerInfo.bankCode"] = updateData.bankDetails.ifsc;
    }

    // Map the updates into the document dynamically via MongoDB $set
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    return updatedUser;
  }
};