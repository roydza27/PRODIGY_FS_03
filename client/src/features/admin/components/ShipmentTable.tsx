import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import ShipmentStatusBadge, { type ShipmentStatus } from "./ShipmentStatusBadge";
import ConfirmDialog from "@/shared/components/confirm-dialog/ConfirmDialog";

export interface Shipment {
  _id: string;
  order: {
    _id: string;
    items: {
      productId: string;
      name: string;
      image?: string;
      price: number;
      quantity: number;
    }[];
    shippingAddress: {
      fullName: string;
      email: string;
    };
    status: string;
    total: number;
    createdAt: string;
    updatedAt: string;
  };
  carrier: string;
  trackingNumber: string;
  status: ShipmentStatus;
  eta: string;
  createdAt: string;
  updatedAt: string;
}

type Props = {
  shipments: Shipment[];
  onStatusChange: (shipmentId: string, status: ShipmentStatus) => void;
  updatingShipmentId?: string | null;
};

export default function ShipmentTable({
  shipments,
  onStatusChange,
  updatingShipmentId,
}: Props) {
  const [draftStatuses, setDraftStatuses] = useState<Record<string, ShipmentStatus>>({});

  useEffect(() => {
    const nextDrafts: Record<string, ShipmentStatus> = {};

    for (const shipment of shipments) {
      nextDrafts[shipment._id] = shipment.status;
    }

    setDraftStatuses(nextDrafts);
  }, [shipments]);
  
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-black/20 text-left text-sm text-zinc-400">
            <tr>
              <th className="px-5 py-4 font-medium">Shipment</th>
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="px-5 py-4 font-medium">Carrier</th>
              <th className="px-5 py-4 font-medium">ETA</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {shipments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-zinc-400">
                  No shipments found.
                </td>
              </tr>
            ) : (
              shipments.map((shipment) => {
                const currentStatus = draftStatuses[shipment._id] ?? shipment.status;

                return (
                  <tr key={shipment._id}>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-white">
                          #{shipment._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-zinc-500">
                          Order #{shipment.order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {shipment.trackingNumber || "No tracking number"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-white">
                          {shipment.order.shippingAddress.fullName || "Unknown Customer"}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {shipment.order.items.length} item
                          {shipment.order.items.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-300">
                      {shipment.carrier}
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-300">
                      {shipment.eta}
                    </td>

                    <td className="px-5 py-4">
                      <ShipmentStatusBadge status={currentStatus} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            setDraftStatuses((prev) => ({
                              ...prev,
                              [shipment._id]: e.target.value as ShipmentStatus,
                            }))
                          }
                          className="h-10 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="packed">Packed</option>
                          <option value="in_transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <ConfirmDialog
                          title="Update shipment?"
                          description={`This will change the shipment status to "${currentStatus}".`}
                          confirmLabel={
                            updatingShipmentId === shipment._id ? "Updating..." : "Update"
                          }
                          onConfirm={async () => {
                            await Promise.resolve(onStatusChange(shipment._id, currentStatus));
                            setDraftStatuses((prev) => ({
                              ...prev,
                              [shipment._id]: currentStatus,
                            }));
                          }}
                          trigger={
                            <Button
                              type="button"
                              disabled={updatingShipmentId === shipment._id}
                              className="rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {updatingShipmentId === shipment._id
                                ? "Updating..."
                                : "Update"}
                            </Button>
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}