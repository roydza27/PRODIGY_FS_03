import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "./employee.service";
import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from "./employee.types";

type AuthUser = {
  userId: string;
  email: string;
  role: string;
};

type AuthenticatedRequest<
  P = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown
> = Request<P, ResBody, ReqBody> & {
  user?: AuthUser;
};

class UnauthorizedError extends Error {
  statusCode = 401;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

const getAdminObjectId = (
  req: AuthenticatedRequest
): mongoose.Types.ObjectId => {
  const rawId = req.user?.userId;

  if (!rawId || !mongoose.Types.ObjectId.isValid(rawId)) {
    throw new UnauthorizedError("Unauthorized");
  }

  return new mongoose.Types.ObjectId(rawId);
};

export const createEmployeeController = async (
  req: AuthenticatedRequest<{}, unknown, CreateEmployeeInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = getAdminObjectId(req);

    const employee = await createEmployee(req.body, {
      createdBy: adminId,
      updatedBy: adminId,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEmployeesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employees = await getAllEmployees(req.query);

    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const employee = await getEmployeeById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployeeController = async (
  req: AuthenticatedRequest<{ id: string }, unknown, UpdateEmployeeInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = getAdminObjectId(req);

    const employee = await updateEmployee(req.params.id, req.body, {
      updatedBy: adminId,
    });

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployeeController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const employee = await deleteEmployee(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};