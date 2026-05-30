import * as React from "react"
import { Mail, Phone, Store, FileText, CalendarDays, Landmark, CheckCircle, XCircle } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import type { AdminSellerApplicationItem } from "@/features/seller/types/seller.types"

type ApplicationDetailsDrawerProps = {
  application: AdminSellerApplicationItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: (application: AdminSellerApplicationItem) => void
  onReject?: (application: AdminSellerApplicationItem) => void
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

export function ApplicationDetailsDrawer({
  application,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ApplicationDetailsDrawerProps) {
  const isMobile = useIsMobile()

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="border-white/10 bg-[#111113] text-[#FAFAFA] md:max-w-xl">
        {application ? (
          <div className="flex h-full flex-col">
            <DrawerHeader className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-4">
                <Avatar className="size-14 border border-white/10 bg-white/5">
                  <AvatarFallback className="bg-transparent text-sm text-[#FAFAFA]">
                    {getInitials(application.sellerInfo?.shopName || application.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <DrawerTitle className="text-2xl">{application.sellerInfo?.shopName || "Unnamed Shop"}</DrawerTitle>
                  <DrawerDescription className="text-[#A1A1AA]">
                    Applicant: {application.name}
                  </DrawerDescription>
                </div>
              </div>

              <div className="mt-4">
                <Badge className={`w-fit rounded-full border px-3 py-1 uppercase tracking-wider text-xs ${statusStyles[application.sellerStatus]}`}>
                  {application.sellerStatus}
                </Badge>
              </div>
            </DrawerHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard icon={<Mail className="h-4 w-4" />} label="Email" value={application.email} />
                <InfoCard icon={<Phone className="h-4 w-4" />} label="Business Phone" value={application.sellerInfo?.businessPhone || "—"} />
                <InfoCard icon={<CalendarDays className="h-4 w-4" />} label="Applied On" value={formatDate(application.sellerAppliedAt)} />
                <InfoCard icon={<FileText className="h-4 w-4" />} label="Business Reg." value={application.sellerInfo?.businessRegistration || "—"} />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="mb-2 flex items-center gap-2 text-sm text-[#A1A1AA]">
                  <Store className="h-4 w-4" /> Shop Description
                </p>
                <p className="text-sm leading-relaxed text-[#FAFAFA]">{application.sellerInfo?.shopDescription || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="mb-4 flex items-center gap-2 text-sm text-[#A1A1AA]">
                  <Landmark className="h-4 w-4" /> Bank Details
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#A1A1AA] block text-xs uppercase mb-1">Account Name</span>
                    <span>{application.sellerInfo?.bankAccountName || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block text-xs uppercase mb-1">Account Number</span>
                    <span className="font-mono">{application.sellerInfo?.bankAccountNumber || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block text-xs uppercase mb-1">IFSC / Bank Code</span>
                    <span className="font-mono">{application.sellerInfo?.bankCode || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block text-xs uppercase mb-1">GST Number</span>
                    <span className="font-mono">{application.sellerInfo?.gstNumber || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            <DrawerFooter className="border-t border-white/10 px-6 py-4">
              {application.sellerStatus === "applied" ? (
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="flex-1 min-w-[180px] rounded-full bg-green-600 text-white hover:bg-green-700"
                    onClick={() => onApprove?.(application)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2 shrink-0" /> 
                    <span className="truncate">Approve Application</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 min-w-[180px] rounded-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 bg-transparent"
                    onClick={() => onReject?.(application)}
                  >
                    <XCircle className="w-4 h-4 mr-2 shrink-0" /> 
                    <span className="truncate">Reject Application</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="rounded-full border-white/10 bg-transparent text-[#FAFAFA] hover:bg-white/5"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              )}
            </DrawerFooter>
          </div>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-[#A1A1AA]">
        {icon}
        {label}
      </div>
      <p className="break-words text-sm text-[#FAFAFA]">{value}</p>
    </div>
  )
}