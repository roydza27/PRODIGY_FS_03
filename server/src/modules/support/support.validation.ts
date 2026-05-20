import { z } from "zod";

export const createSupportTicketSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const updateSupportTicketStatusSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
});