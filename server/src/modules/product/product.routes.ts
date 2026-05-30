import { Router } from "express";
import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetProductById,
  handleGetProducts,
  handleUpdateProduct,
  handleCreateSellerProduct,
  handleGetSellerProducts,
  handleUpdateSellerProduct,
  handleDeleteSellerProduct,
  handleGetSellerProductStats,
} from "./product.controller";
import {
  handleGetProductReviews,
  handleGetProductReviewState,
  handleAddProductReview,
} from "./product.controller";

import { protect, authorizeRoles } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validateBody.middleware";
import {
  createProductSchema,
  updateProductSchema,
  createSellerProductSchema,
  updateSellerProductSchema,
} from "./product.validation";

const router = Router();

// Public routes
router.get("/", handleGetProducts);
router.get("/:id", handleGetProductById);

// Admin routes
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  validateBody(createProductSchema),
  handleCreateProduct
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("admin"),
  validateBody(updateProductSchema),
  handleUpdateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  handleDeleteProduct
);

// Seller routes
router.post(
  "/seller",
  protect,
  authorizeRoles("seller"),
  validateBody(createSellerProductSchema),
  handleCreateSellerProduct
);

router.get(
  "/seller/list",
  protect,
  authorizeRoles("seller"),
  handleGetSellerProducts
);

router.get(
  "/seller/stats",
  protect,
  authorizeRoles("seller"),
  handleGetSellerProductStats
);

router.patch(
  "/seller/:id",
  protect,
  authorizeRoles("seller"),
  validateBody(updateSellerProductSchema),
  handleUpdateSellerProduct
);

router.delete(
  "/seller/:id",
  protect,
  authorizeRoles("seller"),
  handleDeleteSellerProduct
);

router.get("/:id/reviews", handleGetProductReviews);
router.get("/:id/review-state", protect, handleGetProductReviewState);
router.post("/:id/reviews", protect, handleAddProductReview);


export default router;