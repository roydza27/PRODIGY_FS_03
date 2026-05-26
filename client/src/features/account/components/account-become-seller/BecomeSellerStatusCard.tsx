import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { SellerApplication } from "../../types/account-become-seller.types";

type Props = {
  application: SellerApplication;
  onGoToSellerDashboard?: () => void;
};

export default function BecomeSellerStatusCard({
  application,
  onGoToSellerDashboard,
}: Props) {
  const status = application.sellerStatus;

  if (status === "applied") {
    return (
      <Card className="border-yellow-800 bg-yellow-900/20 text-white">
        <CardHeader>
          <CardTitle className="text-yellow-200">Application under review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-yellow-100/90">
            Your seller application is being reviewed by the admin team.
          </p>
          {application.sellerAppliedAt ? (
            <p className="text-xs text-yellow-100/70">
              Applied on {new Date(application.sellerAppliedAt).toLocaleDateString()}
            </p>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (status === "approved") {
    return (
      <Card className="border-emerald-800 bg-emerald-900/20 text-white">
        <CardHeader>
          <CardTitle className="text-emerald-200">Seller access approved</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-emerald-100/90">
            Your seller account is active. You can now access the seller dashboard.
          </p>
          <Badge className="border border-emerald-500/20 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15">
            Approved
          </Badge>
          {onGoToSellerDashboard ? (
            <Button
              type="button"
              onClick={onGoToSellerDashboard}
              className="rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
            >
              Go to seller dashboard
            </Button>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (status === "rejected") {
    return (
      <Card className="border-red-800 bg-red-900/20 text-white">
        <CardHeader>
          <CardTitle className="text-red-200">Application rejected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-red-100/90">
            Your application was not approved. You can review the feedback below and submit again.
          </p>
          {application.sellerRejectionReason ? (
            <Alert className="border-red-800 bg-black/20">
              <AlertDescription className="text-red-100">
                {application.sellerRejectionReason}
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return null;
}