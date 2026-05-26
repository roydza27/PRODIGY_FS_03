import { Router } from "express";
import { protect, authorizeRoles } from "../../middlewares/auth.middleware";

import {
  createShipmentController,
  getShipmentsController,
  getShipmentByIdController,
  updateShipmentController,
  updateShipmentStatusController,
} from "./shipment.controller";

const router = Router();

// Admin only shipment routes
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createShipmentController
);

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getShipmentsController
);

router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  getShipmentByIdController
);

// Full shipment update
router.patch(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateShipmentController
);

// Status only update
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateShipmentStatusController
);

export default router;