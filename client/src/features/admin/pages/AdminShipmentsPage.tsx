import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import AdminPageShell from "../components/AdminPageShell";
import ShipmentTable, { type Shipment } from "../components/ShipmentTable";
import type { ShipmentStatus } from "../components/ShipmentStatusBadge";
import { formatPrice } from "@/features/products/utils/product.helpers";
import { shipmentService } from "../services/shipment.service";

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");
  const [updatingShipmentId, setUpdatingShipmentId] = useState<string | null>(null);

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

      const customerName = shipment.order?.shippingAddress?.fullName || "";
      const orderId = shipment._id.toLowerCase();
      const trackingNumber = shipment.trackingNumber.toLowerCase();
      const carrier = shipment.carrier.toLowerCase();

      const matchesQuery =
        !query ||
        customerName.toLowerCase().includes(query) ||
        orderId.includes(query) ||
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
    const revenue = shipments.reduce((sum, shipment) => sum + (shipment.order?.total || 0), 0);

    return { totalShipments, inTransit, packed, delivered, revenue };
  }, [shipments]);

  const updateShipmentStatus = async (
    shipmentId: string,
    status: ShipmentStatus
  ) => {
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

  return (
    <AdminPageShell
      title="Shipments"
      description="Track dispatch, delivery progress, and carrier status across all orders."
      actions={
        <Button
          onClick={loadShipments}
          className="rounded-xl bg-red-500 hover:bg-red-600"
        >
          Refresh
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-white/10 bg-white/5 text-white md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Shipments
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? "..." : stats.totalShipments}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Packed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{loading ? "..." : stats.packed}</CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              In Transit
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? "..." : stats.inTransit}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? "..." : stats.delivered}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Shipment Value
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? "..." : formatPrice(stats.revenue)}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, carrier, tracking, or order..."
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ShipmentStatus | "all")
            }
            className="h-10 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="packed">Packed</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
          Loading shipments...
        </div>
      ) : (
        <ShipmentTable
          shipments={filteredShipments}
          onStatusChange={updateShipmentStatus}
          updatingShipmentId={updatingShipmentId}
        />
      )}
    </AdminPageShell>
  );
}