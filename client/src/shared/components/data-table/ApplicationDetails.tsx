import * as React from "react"
import { 
  Mail, 
  Phone, 
  Store, 
  FileText, 
  CalendarDays, 
  Landmark, 
  CheckCircle, 
  XCircle 
} from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Textarea } from "@/shared/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { RowDetailsOverlay } from "@/shared/components/data-table/RowDetailsOverlay"
import type { AdminSellerApplicationItem } from "@/features/seller/types/seller.types"

interface ApplicationDetailsProps {
  application: AdminSellerApplicationItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: (application: AdminSellerApplicationItem) => Promise<void> | void
  onReject?: (application: AdminSellerApplicationItem) => Promise<void> | void
  variant?: "drawer" | "modal"
  /** Optional custom action elements slot. If provided, overrides default button trays entirely */
  actions?: React.ReactNode
}

const statusStyles: Record<string, string> = {
  applied: "bg-yellow-500/15 text-yellow-300 border-yellow-500/20",
  approved: "bg-green-500/15 text-green-300 border-green-500/20",
  rejected: "bg-red-500/15 text-red-300 border-red-500/20",
}

function formatDate(value?: string) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()
}

export function ApplicationDetails({
  application,
  open,
  onOpenChange,
  onApprove,
  onReject,
  variant = "drawer",
  actions,
}: ApplicationDetailsProps) {
  const [rejectionReason, setRejectionReason] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!application) return null

  const handleApprove = async () => {
    if (!onApprove) return
    setIsSubmitting(true)
    await onApprove(application)
    setIsSubmitting(false)
  }

  const handleReject = async () => {
    if (!onReject) return
    setIsSubmitting(true)
    await onReject(application)
    setIsSubmitting(false)
    setRejectionReason("")
  }

  // Determine if core management actions are executable by the consumer
  const hasDefaultActions = application.sellerStatus === "applied" && onApprove && onReject

  return (
    <RowDetailsOverlay
      open={open}
      onOpenChange={onOpenChange}
      title={application.sellerInfo?.shopName || "Unnamed Shop"}
      description={`Applicant: ${application.name}`}
      variant={variant}
    >
      <div className="space-y-6">
        
        {/* Profile Metric Sub-Banner */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          <Avatar className="size-12 border border-white/10 bg-white/5">
            <AvatarFallback className="bg-transparent text-xs text-[#FAFAFA]">
              {getInitials(application.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <span className="text-xs font-mono tracking-wider text-zinc-500 block uppercase">Current Status</span>
            <Badge className={`rounded-full border px-2 py-0.5 font-normal uppercase text-[10px] tracking-wider ${statusStyles[application.sellerStatus] || ""}`}>
              {application.sellerStatus}
            </Badge>
          </div>
        </div>

        {/* Badge Metric Matrix */}
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoCard icon={<Mail className="size-4" />} label="Email" value={application.email} />
          <InfoCard icon={<Phone className="size-4" />} label="Business Phone" value={application.sellerInfo?.businessPhone || "—"} />
          <InfoCard icon={<CalendarDays className="size-4" />} label="Applied On" value={formatDate(application.sellerAppliedAt)} />
          <InfoCard icon={<FileText className="size-4" />} label="Business Reg." value={application.sellerInfo?.businessRegistration || "—"} />
        </div>

        {/* Shop Statement Description */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-2 flex items-center gap-2 text-sm text-[#A1A1AA]">
            <Store className="size-4" /> Shop Description
          </p>
          <p className="text-sm leading-relaxed text-[#FAFAFA]">{application.sellerInfo?.shopDescription || "—"}</p>
        </div>

        {/* Financial Settlement Wire Frame */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-4 flex items-center gap-2 text-sm text-[#A1A1AA]">
            <Landmark className="size-4" /> Bank Details
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#A1A1AA] block text-xs uppercase mb-1">Account Name</span>
              <span className="truncate block font-medium">{application.sellerInfo?.bankAccountName || "—"}</span>
            </div>
            <div>
              <span className="text-[#A1A1AA] block text-xs uppercase mb-1">Account Number</span>
              <span className="font-mono block truncate font-medium">{application.sellerInfo?.bankAccountNumber || "—"}</span>
            </div>
            <div>
              <span className="text-[#A1A1AA] block text-xs uppercase mb-1">IFSC Code</span>
              <span className="font-mono block font-medium">{application.sellerInfo?.bankCode || "—"}</span>
            </div>
            <div>
              <span className="text-[#A1A1AA] block text-xs uppercase mb-1">GST Number</span>
              <span className="font-mono block font-medium">{application.sellerInfo?.gstNumber || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Display Textarea Input Field only if default controls are available */}
        {hasDefaultActions && !actions && (
          <div className="space-y-3 border-t border-white/10 pt-4">
            <label className="text-xs uppercase tracking-wide font-medium text-[#A1A1AA]">
              Rejection Reason <span className="text-zinc-500">(Required only if rejecting)</span>
            </label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Provide context explaining the rejection criteria failure..."
              className="bg-white/[0.02] border-white/10 text-white min-h-20 focus-visible:ring-zinc-700"
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* Display historical notes if the application was rejected previously */}
        {!hasDefaultActions && application.sellerRejectionReason && (
          <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl">
            <p className="text-xs uppercase tracking-wide text-red-400 mb-1">Historical Rejection Reason</p>
            <p className="text-sm text-red-200/90">{application.sellerRejectionReason}</p>
          </div>
        )}

        {/* Dynamic Action Control Footer Tray Area */}


      </div>
    </RowDetailsOverlay>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">
        {icon}
        {label}
      </div>
      <p className="break-words text-sm font-medium text-[#FAFAFA]">{value}</p>
    </div>
  )
}