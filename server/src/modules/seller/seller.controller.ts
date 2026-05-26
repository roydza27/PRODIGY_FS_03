import type { Request, Response, NextFunction } from "express";
import { sellerService } from "./seller.service";
import { AppError } from "@/utils/AppError";

// User: Apply to become a seller
export const handleApplyForSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const result = await sellerService.applyForSeller(
      req.user.userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all seller applications
export const handleGetAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applications = await sellerService.getAllApplications();

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// Get single application
export const handleGetApplicationById = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const application = await sellerService.getApplicationById(userId);

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Approve seller
export const handleApproveSeller = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Admin not authenticated", 401);
    }

    const { userId } = req.params;
    const result = await sellerService.approveSeller(
      userId,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Reject seller
export const handleRejectSeller = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Admin not authenticated", 401);
    }

    const { userId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      throw new AppError("Rejection reason is required", 400);
    }

    const result = await sellerService.rejectSeller(userId, rejectionReason);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

// Seller: Get dashboard
export const handleGetSellerDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const dashboard = await sellerService.getSellerDashboard(req.user.userId);

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

// Get public seller profile
export const handleGetSellerProfile = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const profile = await sellerService.getSellerProfile(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// User: Get their seller application status
export const handleGetApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const application = await sellerService.getCurrentUserApplicationStatus(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};