import { Router } from "express";
import { protect, authorizeRoles } from "../../middlewares/auth.middleware";
import {
  createShipmentController,
  getShipmentsController,
  getShipmentByIdController,
  updateShipmentStatusController,
} from "./shipment.controller";

const router = Router();

// Admin only for creation and updates
router.post("/", protect, authorizeRoles("admin"), createShipmentController);
router.get("/", protect, authorizeRoles("admin"), getShipmentsController);
router.get("/:id", protect, authorizeRoles("admin"), getShipmentByIdController);
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateShipmentStatusController
);

export default router;