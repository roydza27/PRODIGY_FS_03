// requireAdmin.middleware.ts

import { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();

  } catch (error) {
    next(error);
  }
};