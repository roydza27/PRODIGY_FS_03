import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import ConfirmDialog from "@/shared/components/confirm-dialog/ConfirmDialog";
import SupportStatusBadge from "./SupportStatusBadge";
import { type SupportStatus } from "../types/support.types";
import type { SupportTicket } from "../services/support.service";

type Props = {
  tickets: SupportTicket[];
  onStatusChange: (ticketId: string, status: SupportStatus) => void;
  updatingTicketId?: string | null;
};

export default function SupportTable({
  tickets,
  onStatusChange,
  updatingTicketId,
}: Props) {
  const [draftStatuses, setDraftStatuses] = useState<Record<string, SupportStatus>>({});
  const currentStatus = draftStatuses[ticket._id] ?? ticket.status;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-black/20 text-left text-sm text-zinc-400">
            <tr>
              <th className="px-5 py-4 font-medium">Ticket</th>
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="px-5 py-4 font-medium">Subject</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-zinc-400">
                  No support tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => {
                const currentStatus = draftStatuses[ticket._id] ?? ticket.status;

                return (
                  <tr key={ticket._id}>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-white">
                          #{ticket._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-white">{ticket.name}</p>
                        <p className="text-xs text-zinc-500">{ticket.email}</p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-white">{ticket.subject}</p>
                        <p className="line-clamp-2 text-xs text-zinc-500">
                          {ticket.message}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <SupportStatusBadge status={ticket.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            setDraftStatuses((prev) => ({
                              ...prev,
                              [ticket._id]: e.target.value as SupportStatus,
                            }))
                          }
                          className="h-10 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>

                        <ConfirmDialog
                          title="Update support ticket?"
                          description={`This will change the ticket status to "${currentStatus}".`}
                          confirmLabel={
                            updatingTicketId === ticket._id ? "Updating..." : "Update"
                          }
                          onConfirm={() => onStatusChange(ticket._id, currentStatus)}
                          trigger={
                            <Button
                              type="button"
                              disabled={updatingTicketId === ticket._id}
                              className="rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {updatingTicketId === ticket._id ? "Updating..." : "Update"}
                            </Button>
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}