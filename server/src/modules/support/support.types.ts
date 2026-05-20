export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface CreateSupportTicketInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  user?: string;
}

export interface UpdateSupportTicketStatusInput {
  status: SupportTicketStatus;
}