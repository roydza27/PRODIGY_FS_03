import { Types } from "mongoose";
import { SupportTicket } from "./support.model";
import type {
  CreateSupportTicketInput,
  SupportTicketStatus,
} from "./support.types";

export async function createSupportTicket(
  payload: CreateSupportTicketInput,
  userId?: string
) {
  const ticket = await SupportTicket.create({
    ...payload,
    user: userId ? new Types.ObjectId(userId) : undefined,
    status: "open",
  });

  return ticket;
}

export async function getSupportTickets() {
  return SupportTicket.find().sort({ createdAt: -1 });
}

export async function getSupportTicketById(id: string) {
  return SupportTicket.findById(id);
}

export async function updateSupportTicketStatus(
  id: string,
  status: SupportTicketStatus
) {
  const ticket = await SupportTicket.findById(id);

  if (!ticket) {
    const error = new Error("Support ticket not found") as any;
    error.statusCode = 404;
    throw error;
  }

  ticket.status = status;
  await ticket.save();

  return ticket;
}