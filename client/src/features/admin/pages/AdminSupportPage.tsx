import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import AdminPageShell from "../components/AdminPageShell";
import SupportTable from "../components/SupportTable";
import type { SupportStatus, SupportTicket } from "../services/support.service";
import { supportService } from "../services/support.service";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SupportStatus | "all">("all");
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await supportService.getAll();
      setTickets(res.tickets || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    const q = search.toLowerCase().trim();

    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "all" ? true : ticket.status === statusFilter;

      const matchesQuery =
        !q ||
        ticket.name.toLowerCase().includes(q) ||
        ticket.email.toLowerCase().includes(q) ||
        ticket.subject.toLowerCase().includes(q) ||
        ticket.message.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [tickets, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in_progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
    };
  }, [tickets]);

  const updateStatus = async (ticketId: string, status: SupportStatus) => {
    try {
      setUpdatingTicketId(ticketId);
      const res = await supportService.updateStatus(ticketId, status);

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, status: res.ticket.status } : ticket
        )
      );

      toast.success("Support ticket updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update ticket");
    } finally {
      setUpdatingTicketId(null);
    }
  };

  return (
    <AdminPageShell
      title="Support"
      description="Manage customer tickets, status updates, and issue resolution."
      actions={
        <Button
          onClick={loadTickets}
          className="rounded-xl bg-red-500 hover:bg-red-600"
        >
          Refresh
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{loading ? "..." : stats.total}</CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Open</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{loading ? "..." : stats.open}</CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{loading ? "..." : stats.inProgress}</CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Resolved</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{loading ? "..." : stats.resolved}</CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, subject, or message..."
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SupportStatus | "all")}
            className="h-10 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
          Loading tickets...
        </div>
      ) : (
        <SupportTable
          tickets={filteredTickets}
          onStatusChange={updateStatus}
          updatingTicketId={updatingTicketId}
        />
      )}
    </AdminPageShell>
  );
}