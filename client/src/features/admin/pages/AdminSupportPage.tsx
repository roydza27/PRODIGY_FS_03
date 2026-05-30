import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import AdminPageShell from "../components/AdminPageShell";
import SupportTable from "../components/SupportTable";
import type { SupportStatus, SupportTicket } from "../services/support.service";
import { supportService } from "../services/support.service";
import {
  Bell,
  Clock3,
  Filter,
  Headphones,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";

const STATUS_OPTIONS = ["all", "open", "in_progress", "resolved", "closed"] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

function SupportSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Card className="border-white/10 bg-[#18181B] shadow-xl">
      <CardContent className="space-y-3 p-6">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-2xl bg-black/20" />
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await supportService.getAll();
      setTickets(res.tickets || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load tickets";
      setError(message);
      toast.error(message);
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
      const matchesStatus = statusFilter === "all" ? true : ticket.status === statusFilter;

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
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "open").length;
    const inProgress = tickets.filter((t) => t.status === "in_progress").length;
    const resolved = tickets.filter((t) => t.status === "resolved").length;
    const closed = tickets.filter((t) => t.status === "closed").length;

    return { total, open, inProgress, resolved, closed };
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update ticket");
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const statusColor = (count: number, label: string) => {
    if (label === "Open") return "text-amber-300";
    if (label === "In Progress") return "text-blue-300";
    if (label === "Resolved") return "text-emerald-300";
    if (label === "Closed") return "text-zinc-300";
    return count > 0 ? "text-white" : "text-zinc-400";
  };

  return (
    <AdminPageShell
      title="Support"
      description="Manage customer tickets, status updates, and issue resolution."
      actions={
        <div className="flex items-center gap-3">
          <Button
            onClick={loadTickets}
            variant="outline"
            className="rounded-xl border-white/10 bg-black/20 text-white hover:bg-white/5"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="rounded-xl bg-[#DB4444] text-white hover:bg-[#c53a3a]">
            New Ticket
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Card className="border-white/10 bg-[#18181B] shadow-xl">
          <CardContent className="grid gap-5 p-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Sparkles className="h-4 w-4 text-[#DB4444]" />
                Support operations
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Keep customer issues moving from open to resolved.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
                Use this dashboard to track ticket volume, prioritize active cases, and keep response times under control.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:justify-self-end">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Total</p>
                <p className="mt-2 text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-amber-200/80">Open</p>
                <p className={`mt-2 text-2xl font-bold ${statusColor(stats.open, "Open")}`}>{stats.open}</p>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-blue-200/80">In Progress</p>
                <p className={`mt-2 text-2xl font-bold ${statusColor(stats.inProgress, "In Progress")}`}>{stats.inProgress}</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-200/80">Resolved</p>
                <p className={`mt-2 text-2xl font-bold ${statusColor(stats.resolved, "Resolved")}`}>{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Total Tickets", value: stats.total, icon: Ticket, color: "text-white" },
            { label: "Open", value: stats.open, icon: Bell, color: "text-amber-300" },
            { label: "In Progress", value: stats.inProgress, icon: Headphones, color: "text-blue-300" },
            { label: "Resolved", value: stats.resolved, icon: ShieldCheck, color: "text-emerald-300" },
            { label: "Closed", value: stats.closed, icon: Clock3, color: "text-zinc-300" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="border-white/10 bg-[#18181B] shadow-xl">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
                      <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-white/10 bg-[#18181B] text-white shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[1fr_220px_120px] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, subject, or message..."
                className="h-12 border-white/10 bg-black/20 pl-9 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
              />
            </div>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className="h-12 border-white/10 bg-black/20 text-white focus:ring-[#DB4444]">
                <Filter className="mr-2 h-4 w-4 text-zinc-500" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#18181B] text-white">
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "all"
                      ? "All statuses"
                      : option.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="h-12 border-white/10 bg-black/20 text-white hover:bg-white/5"
            >
              Clear
            </Button>
          </CardContent>
        </Card>

<div className="w-full">
    {loading ? (
      <SupportSkeleton rows={6} />
    ) : error ? (
      <Card className="border-red-500/20 bg-red-500/10 text-white shadow-xl">
        <CardContent className="space-y-4 p-6">
          <p className="text-lg font-semibold">Failed to load tickets</p>
          <p className="text-sm text-red-200">{error}</p>
          <Button
            onClick={loadTickets}
            className="rounded-xl bg-red-500 hover:bg-red-600"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    ) : (
      <SupportTable
        tickets={filteredTickets}
        onStatusChange={updateStatus}
        updatingTicketId={updatingTicketId}
      />
    )}
</div>
      </div>
    </AdminPageShell>
  );
}