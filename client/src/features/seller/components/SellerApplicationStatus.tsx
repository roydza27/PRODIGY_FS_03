import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { SellerApplication } from "../types/seller.types";

interface SellerApplicationStatusProps {
  application: SellerApplication;
}

export default function SellerApplicationStatus({
  application,
}: SellerApplicationStatusProps) {
  const getStatusColor = () => {
    switch (application.sellerStatus) {
      case "applied":
        return "bg-yellow-900/20 text-yellow-200 border-yellow-800";
      case "approved":
        return "bg-green-900/20 text-green-200 border-green-800";
      case "rejected":
        return "bg-red-900/20 text-red-200 border-red-800";
      case "suspended":
        return "bg-orange-900/20 text-orange-200 border-orange-800";
      default:
        return "bg-gray-900/20 text-gray-200 border-gray-800";
    }
  };

  const getStatusIcon = () => {
    switch (application.sellerStatus) {
      case "applied":
        return <Clock className="w-5 h-5" />;
      case "approved":
        return <CheckCircle2 className="w-5 h-5" />;
      case "rejected":
        return <XCircle className="w-5 h-5" />;
      case "suspended":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (application.sellerStatus) {
      case "applied":
        return "Your application is under review. We'll notify you once it's processed.";
      case "approved":
        return "Congratulations! Your seller application has been approved. You can now start selling.";
      case "rejected":
        return "Your application was not approved. Please review the reason below.";
      case "suspended":
        return "Your seller account has been suspended. Contact support for more information.";
      default:
        return "";
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
    <div className="space-y-4">
      {/* Status Alert */}
      <Alert className={`border ${getStatusColor()}`}>
        <div className="flex items-start gap-3">
          {getStatusIcon()}
          <AlertDescription>{getStatusMessage()}</AlertDescription>
        </div>
      </Alert>

      {/* Application Status Card */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Current status of your seller application</CardDescription>
            </div>
            <Badge className={getStatusColor()}>
              {application.sellerStatus.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Status</p>
              <p className="font-medium text-white capitalize">{application.sellerStatus}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-zinc-400">User ID</p>
              <p className="font-medium text-white text-sm">{application.userId}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Applied On</p>
              <p className="font-medium text-white">{formatDate(application.sellerAppliedAt)}</p>
            </div>

            {application.sellerApprovedAt && (
              <div className="space-y-2">
                <p className="text-sm text-zinc-400">Approved On</p>
                <p className="font-medium text-white">
                  {formatDate(application.sellerApprovedAt)}
                </p>
              </div>
            )}

            {application.sellerRejectedAt && (
              <div className="space-y-2">
                <p className="text-sm text-zinc-400">Rejected On</p>
                <p className="font-medium text-white">
                  {formatDate(application.sellerRejectedAt)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shop Information Card */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg">Shop Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Shop Name</p>
            <p className="font-medium text-white">{application.shopName}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Description</p>
            <p className="text-white text-sm">{application.shopDescription}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Business Email</p>
              <p className="font-medium text-white text-sm">{application.businessEmail}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Business Phone</p>
              <p className="font-medium text-white text-sm">{application.businessPhone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rejection Reason Card */}
      {application.sellerRejectionReason && (
        <Card className="bg-red-900/20 border-red-800">
          <CardHeader>
            <CardTitle className="text-lg text-red-200">Rejection Reason</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-100">{application.sellerRejectionReason}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
