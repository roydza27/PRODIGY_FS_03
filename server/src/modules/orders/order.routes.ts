import { Router } from "express";
import { protect, authorizeRoles } from "../../middlewares/auth.middleware";
import {
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
  getAllOrdersController,
  updateOrderStatusController,
  cancelOrderController
} from "./order.controller";

const router = Router();

router.post("/", protect, createOrderController);
router.get("/", protect, getMyOrdersController);
router.get("/admin/all", protect, authorizeRoles("admin"), getAllOrdersController);
router.get("/:id", protect, getOrderByIdController);
router.patch("/:id/status", protect, authorizeRoles("admin"), updateOrderStatusController);
// Add this line below your other routes
router.patch("/:id/cancel", protect, cancelOrderController);

export default router;