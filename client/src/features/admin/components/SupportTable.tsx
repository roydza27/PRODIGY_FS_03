import React, { useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { 
  GripVertical, 
  MessageSquare, 
  User, 
  Mail, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import TableData from "@/shared/components/data-table/TableData" 
import { RowDetailsOverlay } from "@/shared/components/data-table/RowDetailsOverlay"
import type { SupportTicket, SupportStatus } from "../services/support.service"

type SupportTableProps = {
  tickets: SupportTicket[]
  onStatusChange: (ticketId: string, status: SupportStatus) => void
  updatingTicketId: string | null
}

const statusStyles: Record<SupportStatus, string> = {
  open: "bg-red-500/15 text-red-400 border-red-500/20",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
}

function DragHandle() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5">
      <GripVertical className="size-4" />
    </div>
  )
}

export default function SupportTable({
  tickets,
  onStatusChange,
  updatingTicketId,
}: SupportTableProps) {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)

  const handleResolve = async (ticket: SupportTicket) => {
    await onStatusChange(ticket._id, "resolved")
    setSelectedTicket(null)
  }

  const handleSetPending = async (ticket: SupportTicket) => {
    await onStatusChange(ticket._id, "pending")
    setSelectedTicket(null)
  }

  // 1. Dynamic Tanstack Column Schema definition for Support Tickets
  const supportColumns = useMemo<ColumnDef<SupportTicket>[]>(() => [
    { id: "drag", header: () => null, cell: () => <DragHandle /> },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="font-medium text-white">{row.original.name}</p>
          <p className="text-xs text-zinc-500">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => setSelectedTicket(row.original)}
          className="w-full text-left font-medium text-[#FAFAFA] hover:text-[#FAFAFA]/80 hover:underline bg-transparent border-none p-0 cursor-pointer truncate max-w-[280px]"
        >
          {row.original.subject}
        </button>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge className={`rounded-full border px-2 py-0.5 font-normal uppercase text-[10px] tracking-wider ${statusStyles[status] || ""}`}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTicket(row.original)}
            className="rounded-xl border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 gap-1"
          >
            <MessageSquare className="size-3.5" />
            Review
          </Button>
        </div>
      ),
    },
  ], [])

  return (
    <TableData
      data={tickets}
      columns={supportColumns}
      selectedItem={selectedTicket}
      onSelectedItemChange={setSelectedTicket}
    >
      <RowDetailsOverlay
        title={selectedTicket?.subject || "Support Ticket Details"}
        description={selectedTicket ? `Ticket Reference ID: #${selectedTicket._id.slice(-8).toUpperCase()}` : undefined}
        variant="drawer"
      >
        {selectedTicket && (
          <div className="space-y-6">
            
            {/* Customer Information Cards */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                  <User className="size-4" /> Name
                </div>
                <p className="text-sm font-medium text-[#FAFAFA]">{selectedTicket.name}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
                  <Mail className="size-4" /> Email Address
                </div>
                <p className="break-words text-sm font-medium text-[#FAFAFA]">{selectedTicket.email}</p>
              </div>
            </div>

            {/* Live Status Indicators */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#A1A1AA] uppercase font-medium block mb-1">Ticket Urgency</span>
                <Badge className={`rounded-full border px-2 py-0.5 font-normal uppercase text-[9px] tracking-wider ${statusStyles[selectedTicket.status] || ""}`}>
                  {selectedTicket.status}
                </Badge>
              </div>
              <div className="text-right text-xs text-zinc-500 font-mono">
                {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString("en-IN") : "—"}
              </div>
            </div>

            {/* Main Correspondence Inquiry Body */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-[#A1A1AA] flex items-center gap-1.5">
                <MessageSquare className="size-3.5 text-[#DB4444]" /> Inquiry Message Content
              </p>
              <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                {selectedTicket.message || "No communication body text associated with this active ticket log entry."}
              </p>
            </div>

            {/* Dynamic Operations Processing Panel */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="text-xs uppercase tracking-wide font-medium text-[#A1A1AA] block">
                Administrative Resolution Options
              </span>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {selectedTicket.status !== "resolved" && (
                  <Button
                    disabled={updatingTicketId === selectedTicket._id}
                    className="flex-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    onClick={() => handleResolve(selectedTicket)}
                  >
                    <CheckCircle2 className="size-4 mr-2 shrink-0" />
                    {updatingTicketId === selectedTicket._id ? "Processing..." : "Mark Resolved"}
                  </Button>
                )}
                
                {selectedTicket.status === "open" && (
                  <Button
                    variant="outline"
                    disabled={updatingTicketId === selectedTicket._id}
                    className="flex-1 rounded-xl border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 bg-transparent transition-colors"
                    onClick={() => handleSetPending(selectedTicket)}
                  >
                    <Clock className="size-4 mr-2 shrink-0" />
                    Move to Pending
                  </Button>
                )}
              </div>

              {selectedTicket.status === "resolved" && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-2 text-xs text-emerald-200/90">
                  <AlertCircle className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>This client support case has been closed out. No pending customer metrics require structural adjustments at this moment.</span>
                </div>
              )}
            </div>

          </div>
        )}
      </RowDetailsOverlay>
    </TableData>
  )
}