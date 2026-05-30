import * as React from "react";
import { toast } from "sonner";

import { SellerApplicationTable } from "../components/SellerApplicationTable";
import { ApplicationDetailsDrawer } from "../components/ApplicationDetailsDrawer";
import { SellerApplicationStats } from "../components/SellerApplicationStats";
import { SellerApplicationFilters } from "../components/SellerApplicationFilters";

import { sellerService } from "@/features/seller/services/seller.service";
import type { AdminSellerApplicationItem } from "@/features/seller/types/seller.types";

export default function AdminSellerApplicationsPage() {
  const [applications, setApplications] = React.useState<AdminSellerApplicationItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"all" | "applied" | "approved" | "rejected">("all");

  const [selectedApplication, setSelectedApplication] = React.useState<AdminSellerApplicationItem | null>(null);

  const loadApplications = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await sellerService.getAllApplications();
      setApplications(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load applications";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const filteredApplications = React.useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = status === "all" || app.sellerStatus === status;
      const lower = search.toLowerCase();

      const matchesSearch =
        app.name.toLowerCase().includes(lower) ||
        app.email.toLowerCase().includes(lower) ||
        app.sellerInfo?.shopName?.toLowerCase().includes(lower);

      return matchesStatus && matchesSearch;
    });
  }, [applications, status, search]);

  const stats = React.useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((a) => a.sellerStatus === "applied").length,
      approved: applications.filter((a) => a.sellerStatus === "approved").length,
      rejected: applications.filter((a) => a.sellerStatus === "rejected").length,
    }),
    [applications]
  );

  const handleApprove = async (app: AdminSellerApplicationItem) => {
    try {
      const applicationId = app.userId ?? (app as { _id?: string })._id;

      if (!applicationId) {
        toast.error("Missing application id.");
        return;
      }

      const res = await sellerService.approveSeller(applicationId);

      if (res.success) {
        toast.success("Application approved!");
        setSelectedApplication(null);
        await loadApplications();
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to approve application."
      );
    }
  };

  const handleReject = async (app: AdminSellerApplicationItem) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const applicationId = app.userId ?? (app as { _id?: string })._id;

      if (!applicationId) {
        toast.error("Missing application id.");
        return;
      }

      const res = await sellerService.rejectSeller(applicationId, reason);

      if (res.success) {
        toast.success("Application rejected.");
        setSelectedApplication(null);
        await loadApplications();
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reject application."
      );
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#111113]/95 text-[#FAFAFA]">
      <div className="flex flex-col gap-6 px-4 py-4 lg:px-6 lg:py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Seller Applications
            </h1>
            <p className="text-sm text-[#A1A1AA]">
              Manage incoming marketplace vendor requests.
            </p>
          </div>
        </div>

        <SellerApplicationStats
          total={stats.total}
          pending={stats.pending}
          approved={stats.approved}
          rejected={stats.rejected}
        />

        <SellerApplicationFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          onApply={() => {}}
        />

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-10 text-center text-[#A1A1AA]">
            Loading applications...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-red-200">
            {error}
          </div>
        ) : (
          <SellerApplicationTable
            data={filteredApplications}
            onViewApplication={setSelectedApplication}
            onApproveApplication={handleApprove}
            onRejectApplication={handleReject}
          />
        )}
      </div>

      <ApplicationDetailsDrawer
        application={selectedApplication}
        open={Boolean(selectedApplication)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedApplication(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}