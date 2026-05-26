import { Router } from "express";
import { protect, authorizeRoles } from "../../middlewares/auth.middleware";
import {
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
  getAllOrdersController,
  updateOrderStatusController,
} from "./order.controller";

const router = Router();

router.post("/", protect, createOrderController);
router.get("/", protect, getMyOrdersController);
router.get("/admin/all", protect, authorizeRoles("admin"), getAllOrdersController);
router.get("/:id", protect, getOrderByIdController);
router.patch("/:id/status", protect, authorizeRoles("admin"), updateOrderStatusController);

export default router;