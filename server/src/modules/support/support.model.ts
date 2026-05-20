import { Schema, model, type Types } from "mongoose";

interface SupportTicketDocument {
  user?: Types.ObjectId;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const supportTicketSchema = new Schema<SupportTicketDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export const SupportTicket = model<SupportTicketDocument>(
  "SupportTicket",
  supportTicketSchema
);