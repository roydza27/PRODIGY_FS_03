import type { Request, Response, NextFunction } from "express";
import {
  createSupportTicketSchema,
  updateSupportTicketStatusSchema,
} from "./support.validation";
import {
  createSupportTicket,
  getSupportTicketById,
  getSupportTickets,
  updateSupportTicketStatus,
} from "./support.service";

export async function createSupportTicketController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = createSupportTicketSchema.parse(req.body);
    const userId = req.user?.userId;

    const ticket = await createSupportTicket(parsed, userId);

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSupportTicketsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tickets = await getSupportTickets();

    return res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSupportTicketByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ticket = await getSupportTicketById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    return res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSupportTicketStatusController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = updateSupportTicketStatusSchema.parse(req.body);
    const ticket = await updateSupportTicketStatus(req.params.id, parsed.status);

    return res.json({
      success: true,
      message: "Support ticket status updated successfully",
      ticket,
    });
  } catch (error) {
    next(error);
  }
}