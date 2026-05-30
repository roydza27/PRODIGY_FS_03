import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import SellerApplicationForm from "../components/SellerApplicationForm";
import SellerApplicationStatus from "../components/SellerApplicationStatus";
import SellerOnboardingChecklist from "../components/SellerOnboardingChecklist";
import { sellerService } from "../services/seller.service";
import type { SellerApplicationFormData, SellerApplication } from "../types/seller.types";
import { useAuthStore } from "@/app/store/auth.store";

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111113] px-4 text-white">
      <Card className="w-full max-w-md border-white/10 bg-[#18181B] shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#DB4444] border-t-transparent" />
          <p className="text-sm text-zinc-400">Loading your seller application...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SellerApplicationPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.isLoading);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [existingApplication, setExistingApplication] = useState<SellerApplication | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role === "seller") {
      navigate("/seller", { replace: true });
    }
  }, [user, navigate]);

  const loadApplicationStatus = async () => {
    try {
      setIsCheckingStatus(true);
      setError(null);

      const application = await sellerService.getApplicationStatus();
      setExistingApplication(application);
    } catch (err) {
      if (err instanceof Error) {
        const message = err.message.toLowerCase();

        const noApplicationYet =
          message.includes("application not found") ||
          message.includes("user has not applied to become a seller");

        if (noApplicationYet) {
          setExistingApplication(null);
          return;
        }

        if (message.includes("401") || message.includes("unauthorized")) {
          toast.error("Please log in to check your application status.");
        } else {
          setError(err.message);
        }
      }
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (!user || user.role === "seller") return;
    void loadApplicationStatus();
  }, [user]);

  const handleSubmit = async (data: SellerApplicationFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await sellerService.applyForSeller(data);

      if (response.success) {
        toast.success("Seller application submitted successfully!");
        await loadApplicationStatus();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit application";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isCheckingStatus) return <LoadingState />;
  if (!user) return null;
  if (user.role === "seller") return null;

  const canApply = !existingApplication || existingApplication.sellerStatus === "rejected";
  const isPending = existingApplication?.sellerStatus === "applied";
  const isApproved = existingApplication?.sellerStatus === "approved";
  const isRejected = existingApplication?.sellerStatus === "rejected";

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      {/* FIXED: Changed trailing 'text' typo utility to explicit 'text-left' alignment */}
      <div className="mx-auto max-w-7xl space-y-6 text-left">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Info className="h-4 w-4 text-[#DB4444]" />
            Seller onboarding
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Become a Seller
          </h1>
          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            Start your journey as a seller on LocalStore marketplace.
          </p>
        </div>

        <Separator className="bg-zinc-800" />

        <Alert className="border-blue-800 bg-blue-900/20">
          <Info className="h-4 w-4 text-blue-200" />
          <AlertDescription className="text-blue-100">
            Complete the form below with your shop and business details. Our admin team will review
            your application and get back to you within 2-3 business days.
          </AlertDescription>
        </Alert>

        {existingApplication ? (
          <div className="space-y-4">
            <div>
              <h2 className="mb-4 text-2xl font-semibold">Your Application</h2>
              <SellerApplicationStatus application={existingApplication} />
            </div>

            {isPending && (
              <Alert className="border-yellow-800 bg-yellow-900/20">
                <AlertCircle className="h-4 w-4 text-yellow-200" />
                <AlertDescription className="text-yellow-100">
                  Your application is pending review. You cannot submit a new application until this one is processed.
                </AlertDescription>
              </Alert>
            )}

            {isApproved && (
              <Card className="border-green-800 bg-green-900/20">
                <CardHeader>
                  <CardTitle className="text-green-200">Application Approved!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-green-100">
                    Your seller account is active. You can now access the seller dashboard and start managing your products.
                  </p>
                  <button
                    onClick={() => navigate("/seller")}
                    className="inline-flex items-center rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                  >
                    Go to Seller Dashboard
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            )}

            {isRejected && (
              <Alert className="border-red-800 bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-200" />
                <AlertDescription className="text-red-100">
                  Unfortunately, your application was not approved. You can submit a new application after addressing the concerns mentioned below.
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : null}

        {error ? (
          <Alert className="border-red-800 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-200" />
            <AlertDescription className="text-red-100">{error}</AlertDescription>
          </Alert>
        ) : null}

        {canApply ? (
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h2 className="mb-4 text-2xl font-semibold">Application Form</h2>
              <SellerApplicationForm onSubmit={handleSubmit} isLoading={isSubmitting} />
            </div>

            <div className="space-y-6">
              <SellerOnboardingChecklist />

              <Card className="border-white/10 bg-[#18181B] text-white shadow-xl">
                <CardHeader>
                  <CardTitle>Required Information</CardTitle>
                  <CardDescription className="text-zinc-400">What we need from you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DB4444]/20">
                        <span className="text-xs font-semibold text-[#ffd7d7]">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Shop Information</p>
                        <p className="text-sm text-zinc-400">Shop name, description, and category</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DB4444]/20">
                        <span className="text-xs font-semibold text-[#ffd7d7]">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Contact Details</p>
                        <p className="text-sm text-zinc-400">Valid business email and phone number</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DB4444]/20">
                        <span className="text-xs font-semibold text-[#ffd7d7]">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Banking Information</p>
                        <p className="text-sm text-zinc-400">Bank account details for payouts</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DB4444]/20">
                        <span className="text-xs font-semibold text-[#ffd7d7]">4</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Business Documents</p>
                        <p className="text-sm text-zinc-400">Registration number and GST (if applicable)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}

        {isPending ? (
          <Card className="border-white/10 bg-[#18181B] text-white shadow-xl">
            <CardContent className="p-6">
              <p className="text-sm text-zinc-400">
                You already have a pending application. Please wait for review before submitting another one.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}