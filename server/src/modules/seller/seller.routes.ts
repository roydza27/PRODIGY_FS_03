import { Router } from "express";
import {
  handleApplyForSeller,
  handleGetApplicationStatus,
  handleGetAllApplications,
  handleGetApplicationById,
  handleApproveSeller,
  handleRejectSeller,
  handleGetSellerDashboard,
  handleGetSellerProfile,
  handleUpdateSellerSettings,
} from "./seller.controller";

import {
  handleCreateSellerProduct,
  handleGetSellerProducts,
  handleUpdateSellerProduct,
  handleDeleteSellerProduct,
  handleGetSellerProductStats,
} from "@/modules/product/product.controller";

import { protect, authorizeRoles } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validateBody.middleware";
import {
  sellerApplicationSchema,
  sellerApprovalSchema,
} from "./seller.validation";
import {
  createSellerProductSchema,
  updateSellerProductSchema,
} from "@/modules/product/product.validation";

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================
router.get("/profile/:userId", handleGetSellerProfile);

// ============================================
// PROTECTED USER ROUTES (Seller Application Management)
// ============================================
router.post(
  "/apply",
  protect,
  validateBody(sellerApplicationSchema),
  handleApplyForSeller
);

router.get("/status", protect, handleGetApplicationStatus);

router.get("/dashboard", protect, handleGetSellerDashboard);

// ============================================
// PROTECTED SELLER ROUTES (Product Management)
// ============================================
// Only approved sellers can create/manage products
router.post(
  "/products",
  protect,
  authorizeRoles("seller"),
  validateBody(createSellerProductSchema),
  handleCreateSellerProduct
);

router.get(
  "/products",
  protect,
  authorizeRoles("seller"),
  handleGetSellerProducts
);

router.get(
  "/products/stats",
  protect,
  authorizeRoles("seller"),
  handleGetSellerProductStats
);

router.patch(
  "/products/:id",
  protect,
  authorizeRoles("seller"),
  validateBody(updateSellerProductSchema),
  handleUpdateSellerProduct
);

router.delete(
  "/products/:id",
  protect,
  authorizeRoles("seller"),
  handleDeleteSellerProduct
);

// ============================================
// ADMIN ROUTES (Seller Application Management)
// ============================================
router.get(
  "/admin/applications",
  protect,
  authorizeRoles("admin"),
  handleGetAllApplications
);

router.get(
  "/admin/applications/:userId",
  protect,
  authorizeRoles("admin"),
  handleGetApplicationById
);

router.post(
  "/admin/approve/:userId",
  protect,
  authorizeRoles("admin"),
  handleApproveSeller
);

router.post(
  "/admin/reject/:userId",
  protect,
  authorizeRoles("admin"),
  validateBody(sellerApprovalSchema),
  handleRejectSeller
);

// Add this under your protected seller routes
router.patch(
  "/settings",
  protect,
  authorizeRoles("seller"),
  // validateBody(updateSellerSettingsSchema), // Optional: Add Zod validation
  handleUpdateSellerSettings // You'll need to create this in seller.controller.ts
);


export default router;
