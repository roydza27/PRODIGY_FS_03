import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import type { AdminSellerApplicationItem } from "../../seller/types/seller.types";

interface ApplicationDetailsModalProps {
  application: AdminSellerApplicationItem | null;
  isOpen: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  rejectionReason: string;
  onSetRejectionReason: (reason: string) => void;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  onClose: () => void;
}

export default function ApplicationDetailsModal({
  application,
  isOpen,
  isApproving,
  isRejecting,
  rejectionReason,
  onSetRejectionReason,
  onApprove,
  onReject,
  onClose,
}: ApplicationDetailsModalProps) {
  if (!application) return null;

  const getStatusIcon = () => {
    switch (application.sellerStatus) {
      case "applied":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (application.sellerStatus) {
      case "applied":
        return <Badge className="bg-yellow-600 text-white">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-600 text-white">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-600 text-white">Rejected</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isApproving && !isRejecting && onClose()}>
      <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {application.sellerInfo?.shopName}
              </DialogTitle>
              <DialogDescription>Application from {application.name}</DialogDescription>
            </div>
            <div className="flex items-center gap-2">{getStatusIcon()}{getStatusBadge()}</div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Applicant Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Applicant Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-zinc-400">Name</p>
                <p className="text-white">{application.name}</p>
              </div>
              <div>
                <p className="text-zinc-400">Email</p>
                <p className="text-white">{application.email}</p>
              </div>
            </div>
          </div>

          {/* Shop Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Shop Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-zinc-400">Shop Name</p>
                <p className="text-white">{application.sellerInfo?.shopName}</p>
              </div>
              <div>
                <p className="text-zinc-400">Description</p>
                <p className="text-white text-sm">{application.sellerInfo?.shopDescription}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-zinc-400">Business Email</p>
                <p className="text-white">{application.sellerInfo?.businessEmail}</p>
              </div>
              <div>
                <p className="text-zinc-400">Business Phone</p>
                <p className="text-white">{application.sellerInfo?.businessPhone}</p>
              </div>
            </div>
          </div>

          {/* Application Status */}
          <div className="space-y-3 border-t border-zinc-800 pt-4">
            <h3 className="font-semibold text-white">Application Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-zinc-400">Status</p>
                <p className="text-white capitalize">{application.sellerStatus}</p>
              </div>
              <div>
                <p className="text-zinc-400">Applied On</p>
                <p className="text-white">{formatDate(application.sellerAppliedAt)}</p>
              </div>
            </div>

            {application.sellerRejectionReason && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-md">
                <p className="text-sm text-zinc-400 mb-1">Rejection Reason</p>
                <p className="text-red-100">{application.sellerRejectionReason}</p>
              </div>
            )}
          </div>

          {/* Action Buttons - Only for pending applications */}
          {application.sellerStatus === "applied" && (
            <div className="space-y-4 border-t border-zinc-800 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Rejection Reason (if rejecting)
                </label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => onSetRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection (optional if approving)"
                  className="bg-zinc-800 border-zinc-700 text-white min-h-24"
                  disabled={isApproving || isRejecting}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={onApprove}
                  disabled={isApproving || isRejecting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isApproving ? "Approving..." : "Approve Application"}
                </Button>
                <Button
                  onClick={onReject}
                  disabled={isApproving || isRejecting}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isRejecting ? "Rejecting..." : "Reject Application"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
