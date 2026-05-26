import type { Request, Response, NextFunction } from "express";

import {
  createShipmentSchema,
  updateShipmentSchema,
  updateShipmentStatusSchema,
} from "./shipment.validation";

import {
  createShipment,
  getShipmentById,
  getShipments,
  updateShipment,
  updateShipmentStatus,
} from "./shipment.service";

export async function createShipmentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = createShipmentSchema.parse(req.body);
    const shipment = await createShipment(parsed);

    return res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      shipment,
    });
  } catch (error) {
    next(error);
  }
}

export async function getShipmentsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const shipments = await getShipments();

    return res.json({
      success: true,
      shipments,
    });
  } catch (error) {
    next(error);
  }
}

export async function getShipmentByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const shipment = await getShipmentById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    return res.json({
      success: true,
      shipment,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateShipmentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = updateShipmentSchema.parse(req.body);

    const shipment = await updateShipment(req.params.id, parsed);

    return res.json({
      success: true,
      message: "Shipment updated successfully",
      shipment,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateShipmentStatusController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = updateShipmentStatusSchema.parse(req.body);

    const shipment = await updateShipmentStatus(
      req.params.id,
      parsed.status
    );

    return res.json({
      success: true,
      message: "Shipment status updated successfully",
      shipment,
    });
  } catch (error) {
    next(error);
  }
}