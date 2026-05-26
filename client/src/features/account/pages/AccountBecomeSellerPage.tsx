import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Separator } from "@/shared/components/ui/separator";
import { useAuthStore } from "@/app/store/auth.store";

import BecomeSellerHeader from "../components/account-become-seller/BecomeSellerHeader";
import BecomeSellerBenefits from "../components/account-become-seller/BecomeSellerBenefits";
import BecomeSellerRequirements from "../components/account-become-seller/BecomeSellerRequirements";
import BecomeSellerStatusCard from "../components/account-become-seller/BecomeSellerStatusCard";
import BecomeSellerFormCard from "../components/account-become-seller/BecomeSellerFormCard";
import { accountBecomeSellerService } from "../services/account-become-seller.service";
import type {
  SellerApplication,
  SellerApplicationFormData,
} from "../types/account-become-seller.types";
import { AlertCircle, Info } from "lucide-react";

export default function AccountBecomeSellerPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.isLoading);

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [application, setApplication] = useState<SellerApplication | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const data = await accountBecomeSellerService.getApplicationStatus();
      setApplication(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load seller status";
      setError(message);
      toast.error(message);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role === "seller") {
      navigate("/seller", { replace: true });
      return;
    }

    loadStatus();
  }, [authLoading, user, navigate]);

  const handleSubmit = async (data: SellerApplicationFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await accountBecomeSellerService.applyForSeller(data);

      if (response.success) {
        toast.success("Seller application submitted successfully");
        await loadStatus();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit application";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isCheckingStatus) {
    return (
      <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-center py-24">
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  const showForm = !application || application.sellerStatus === "rejected";

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <BecomeSellerHeader
          title="Become a Seller"
          description="Apply to open your own storefront on LocalStore. Once approved, you will unlock the seller dashboard and start managing products."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Alert className="border-blue-800 bg-blue-900/20">
              <Info className="h-4 w-4 text-blue-200" />
              <AlertDescription className="text-blue-100">
                Buyers can apply to become sellers. Your account stays as a normal buyer until admin approval.
              </AlertDescription>
            </Alert>

            {error ? (
              <Alert className="border-red-800 bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-200" />
                <AlertDescription className="text-red-100">{error}</AlertDescription>
              </Alert>
            ) : null}

            {application ? (
              <BecomeSellerStatusCard
                application={application}
                onGoToSellerDashboard={() => navigate("/seller")}
              />
            ) : null}

            {showForm ? (
              <BecomeSellerFormCard
                isSubmitting={isLoading}
                onSubmit={handleSubmit}
              />
            ) : null}

            {!showForm && application?.sellerStatus === "applied" ? (
              <Alert className="border-yellow-800 bg-yellow-900/20">
                <AlertCircle className="h-4 w-4 text-yellow-200" />
                <AlertDescription className="text-yellow-100">
                  Your application is pending review. You cannot submit a new application right now.
                </AlertDescription>
              </Alert>
            ) : null}
          </div>

          <div className="space-y-6">
            <BecomeSellerBenefits />
            <BecomeSellerRequirements />

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-300">
              <p className="font-medium text-white">How it works</p>
              <Separator className="my-4 bg-white/10" />
              <div className="space-y-3">
                <p>1. Fill out your shop and business details.</p>
                <p>2. Admin reviews your application.</p>
                <p>3. Approved sellers unlock their dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}