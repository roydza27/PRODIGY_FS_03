import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import AdminPageShell from "../components/AdminPageShell";
import ShipmentTable from "../components/ShipmentTable";
import type { Shipment, ShipmentStatus } from "../services/shipment.service";
import { formatPrice } from "@/features/products/utils/product.helpers";
import { shipmentService } from "../services/shipment.service";
import {
  PackageCheck,
  RefreshCw,
  Truck,
  Warehouse,
  CircleCheck,
  Plus,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

const STATUS_OPTIONS = [
  "all",
  "pending",
  "packed",
  "in_transit",
  "delivered",
  "cancelled",
] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number];

type ShipmentFormState = {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  eta: string;
  status: ShipmentStatus;
  assignedToName: string;
  assignedToRole: string;
  assignedToPhone: string;
  assignedNotes: string;
};

const EMPTY_FORM: ShipmentFormState = {
  orderId: "",
  carrier: "",
  trackingNumber: "",
  eta: "",
  status: "pending",
  assignedToName: "",
  assignedToRole: "",
  assignedToPhone: "",
  assignedNotes: "",
};

function ShipmentSkeleton({ rows = 6 }: { rows?: number }) {
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

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [updatingShipmentId, setUpdatingShipmentId] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingShipment, setCreatingShipment] = useState(false);
  const [form, setForm] = useState<ShipmentFormState>(EMPTY_FORM);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const res = await shipmentService.getAll();
      setShipments(res.shipments || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load shipments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const filteredShipments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return shipments.filter((shipment) => {
      const matchesStatus =
        statusFilter === "all" ? true : shipment.status === statusFilter;

      const customerName = shipment.order?.shippingAddress?.fullName?.toLowerCase() ?? "";
      const customerEmail = shipment.order?.shippingAddress?.email?.toLowerCase() ?? "";
      const orderId = shipment.order?._id?.toLowerCase() ?? "";
      const shipmentId = shipment._id.toLowerCase();
      const trackingNumber = shipment.trackingNumber.toLowerCase();
      const carrier = shipment.carrier.toLowerCase();

      const matchesQuery =
        !query ||
        customerName.includes(query) ||
        customerEmail.includes(query) ||
        orderId.includes(query) ||
        shipmentId.includes(query) ||
        trackingNumber.includes(query) ||
        carrier.includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [shipments, search, statusFilter]);

  const stats = useMemo(() => {
    const totalShipments = shipments.length;
    const inTransit = shipments.filter((s) => s.status === "in_transit").length;
    const packed = shipments.filter((s) => s.status === "packed").length;
    const delivered = shipments.filter((s) => s.status === "delivered").length;
    const pending = shipments.filter((s) => s.status === "pending").length;
    const revenue = shipments.reduce((sum, shipment) => sum + (shipment.order?.total || 0), 0);

    return { totalShipments, inTransit, packed, delivered, pending, revenue };
  }, [shipments]);

  const updateShipmentStatus = async (shipmentId: string, status: ShipmentStatus) => {
    const targetShipment = shipments.find((shipment) => shipment._id === shipmentId);

    try {
      setUpdatingShipmentId(shipmentId);
      const res = await shipmentService.updateStatus(shipmentId, status);

      setShipments((prev) =>
        prev.map((shipment) =>
          shipment._id === shipmentId ? { ...shipment, status: res.shipment.status } : shipment
        )
      );

      toast.success("Shipment status updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update shipment");
    } finally {
      setUpdatingShipmentId(null);
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.orderId.trim() ||
      !form.carrier.trim() ||
      !form.trackingNumber.trim() ||
      !form.eta.trim()
    ) {
      toast.error("Please fill in order ID, carrier, tracking number, and ETA");
      return;
    }

    try {
      setCreatingShipment(true);

      await shipmentService.create({
        orderId: form.orderId.trim(),
        carrier: form.carrier.trim(),
        trackingNumber: form.trackingNumber.trim(),
        eta: form.eta.trim(),
        status: form.status,
      });

      toast.success("Shipment created successfully");
      setForm(EMPTY_FORM);
      setShowCreateForm(false);
      await loadShipments();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create shipment");
    } finally {
      setCreatingShipment(false);
    }
  };

  const handleEditShipment = async (
    shipmentId: string,
    payload: {
      carrier: string;
      trackingNumber: string;
      eta: string;
      status: ShipmentStatus;
    }
  ) => {
    try {
      setUpdatingShipmentId(shipmentId);

      const res = await shipmentService.update(shipmentId, payload);

      setShipments((prev) =>
        prev.map((shipment) =>
          shipment._id === shipmentId ? { ...shipment, ...res.shipment } : shipment
        )
      );

      toast.success("Shipment updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update shipment");
    } finally {
      setUpdatingShipmentId(null);
    }
  };

  return (
    <AdminPageShell
      title="Shipments"
      description="Track dispatch, delivery progress, carrier status, and logistics assignment across all orders."
      actions={
        <div className="flex items-center gap-3">
          <Button
            onClick={loadShipments}
            variant="outline"
            className="rounded-xl border-white/10 bg-black/20 text-white hover:bg-white/5"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="rounded-xl bg-[#DB4444] text-white hover:bg-[#c53a3a]"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showCreateForm ? "Close" : "Create Shipment"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-6">
          {[
            {
              label: "Packed",
              value: stats.packed,
              icon: PackageCheck,
              color: "text-[#DB4444]",
              ring: "border-[#DB4444]/20 bg-[#DB4444]/10",
            },
            {
              label: "In Transit",
              value: stats.inTransit,
              icon: Truck,
              color: "text-blue-300",
              ring: "border-blue-500/20 bg-blue-500/10",
            },
            {
              label: "Delivered",
              value: stats.delivered,
              icon: CircleCheck,
              color: "text-emerald-300",
              ring: "border-emerald-500/20 bg-emerald-500/10",
            },
            {
              label: "Shipment Value",
              value: loading ? "..." : formatPrice(stats.revenue),
              icon: Warehouse,
              color: "text-amber-300",
              ring: "border-amber-500/20 bg-amber-500/10",
            },
          ].map((item) => {
            // Capitalizing component reference locally to satisfy React JSX parsing constraints
            const Icon = item.icon;
            return (
              <Card key={item.label} className="border-white/10 bg-[#18181B] shadow-xl rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs uppercase font-semibold tracking-wider text-zinc-500 truncate">
                        {item.label}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-white font-mono truncate">
                        {item.value}
                      </p>
                    </div>
                    <div className={`rounded-2xl border p-3 shrink-0 ${item.ring}`}>
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="">
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            {loading ? (
              <ShipmentSkeleton rows={6} />
            ) : (
              <ShipmentTable
                shipments={filteredShipments}
                onStatusChange={updateShipmentStatus}
                onEditShipment={handleEditShipment}
                updatingShipmentId={updatingShipmentId}
              />
            )}
          </div>

          <div className="mx-6 space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Delivery Summary Card */}
            <Card className="border-white/10 bg-[#18181B] text-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Delivery Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-300">
                {[
                  { label: "Total shipments", value: stats.totalShipments, color: "text-white" },
                  { label: "In transit", value: stats.inTransit, color: "text-blue-300" },
                  { label: "Packed", value: stats.packed, color: "text-[#DB4444]" },
                  { label: "Delivered", value: stats.delivered, color: "text-emerald-300" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-white/10">
                    <span className="text-zinc-400">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Ops Notes Card */}
            <Card className="border-white/10 bg-[#18181B] text-white shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <ClipboardList className="h-5 w-5 text-zinc-500" />
                  Ops Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-zinc-400 ">
                <p className="leading-relaxed">Prioritize packed shipments that have not moved to transit yet.</p>
                
                <div className="flex gap-3 rounded-2xl border border-[#DB4444]/20 bg-[#DB4444]/5 p-4 text-[#ffc1c1]">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#DB4444]" />
                  <p className="text-sm font-medium leading-relaxed">
                    Review delayed carrier updates before the next dispatch batch.
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  View carrier performance
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}