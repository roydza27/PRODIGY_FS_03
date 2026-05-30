"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Clock3,
  Download,
  HelpCircle,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  User,
  CreditCard,
  Mail,
  AlertCircle,
  Copy,
  XCircle,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { toast } from "sonner";

import { orderService } from "../services/order.service";
import type { Order } from "../types/order.types";
import { formatPrice } from "@/features/products/utils/product.helpers";

import ShippingTracker from "../components/account-order-details/ShippingTracker";

type Step = {
  label: string;
  key: "placed" | "processing" | "shipped" | "delivered";
};

const ORDER_STEPS: Step[] = [
  { label: "Placed", key: "placed" },
  { label: "Processing", key: "processing" },
  { label: "Shipped", key: "shipped" },
  { label: "Delivered", key: "delivered" },
];

function normalizeStatus(status: string) {
  return status?.toLowerCase?.() ?? "";
}

function formatDate(value?: string | Date) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatDateTime(value?: string | Date) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function safeText(value?: string | null) {
  return value && value.trim() ? value : "Not provided";
}

function StatusBadge({ status }: { status: string }) {
  const s = normalizeStatus(status);

  const config =
    s === "delivered"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : s === "shipped"
        ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
        : s === "processing"
          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
          : "bg-white/5 text-zinc-300 border-white/10";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${config}`}
    >
      {status || "unknown"}
    </span>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="rounded-xl bg-white/5 p-2 text-zinc-300">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
        <p className="mt-1 truncate text-sm text-white">{value}</p>
      </div>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-10 w-40 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-48 animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="h-80 animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />
            <div className="h-56 animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />
          </div>
          <div className="h-[520px] animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default function AccountOrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadOrder() {
      if (!id) {
        navigate("/account/orders");
        return;
      }

      try {
        setLoading(true);
        const res = await orderService.getById(id);
        if (!alive) return;

        setOrder((res as any).order ?? res);
      } catch (error) {
        console.error("Failed to load order details:", error);
        toast.error("Failed to load order details");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadOrder();

    return () => {
      alive = false;
    };
  }, [id, navigate]);

  if (loading) return <OrderSkeleton />;

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111113]/95 p-8 text-center text-zinc-400">
        Order not found.
      </div>
    );
  }

  const itemCount =
    order.items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) ?? 0;

  const subtotal =
    order.items?.reduce(
      (sum: number, item: any) =>
        sum + Number(item.price || 0) * Number(item.quantity || 1),
      0,
    ) ?? order.total ?? 0;

// REPLACE your existing handleCancelOrder with this:
  const handleCancelOrder = async () => {
    if (!order) return;
    
    try {
      setIsCancelling(true);
      await orderService.cancelOrder(order._id);
      
      toast.success("Order cancelled successfully");
      setOrder({ ...order, status: "cancelled" } as Order); 
      
      // Close the modal cleanly after the network request finishes
      setShowCancelDialog(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const shippingAddress = (order as any).shippingAddress ?? {};
  const payment = (order as any).payment ?? (order as any).paymentMethod ?? {};
  const tracking = (order as any).tracking ?? {};
  const note = (order as any).note ?? (order as any).customerNote ?? "";

  const currentStatus = normalizeStatus(order.status);
  const canCancel = !["shipped", "delivered", "cancelled"].includes(currentStatus);

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl text-left">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>

            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Order #{String(order._id).slice(-8).toUpperCase()}
              </p>
              <StatusBadge status={order.status} />
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Order Details
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              View your order items, shipping information, payment summary, and current fulfillment status.
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-400">
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(order.createdAt)}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                <Clock3 className="h-4 w-4" />
                {formatDateTime((order as any).updatedAt || order.createdAt)}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                <ShieldCheck className="h-4 w-4" />
                Secure order record
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl border-white/10 bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Invoice
            </Button>
            <Button variant="outline" className="rounded-xl border-white/10 bg-transparent">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
          </div>
        </div>

        <ShippingTracker order={order} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-zinc-400" />
                  Items ({itemCount})
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pt-6">
                {order.items?.length ? (
                  order.items.map((item: any, index: number) => {
                    const title = item.name || item.title || item.product?.name || "Item";
                    const image =
                      item.image ||
                      item.product?.image ||
                      item.product?.images?.[0] ||
                      "";
                    const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);

                    return (
                      <div
                        key={item._id || index}
                        className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                          {image ? (
                            <img
                              src={image}
                              alt={title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-xs text-zinc-500">No image</div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-white">{title}</p>
                              <p className="mt-1 text-sm text-zinc-500">
                                Qty: {item.quantity || 1}
                                {item.variant ? ` • ${item.variant}` : ""}
                                {item.sku ? ` • SKU: ${item.sku}` : ""}
                              </p>
                            </div>
                            <p className="shrink-0 font-semibold text-white">
                              {formatPrice(lineTotal)}
                            </p>
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <InfoRow
                              icon={CreditCard}
                              label="Unit Price"
                              value={formatPrice(Number(item.price || 0))}
                            />
                            <InfoRow
                              icon={Package}
                              label="Quantity"
                              value={String(item.quantity || 1)}
                            />
                            <InfoRow
                              icon={MapPin}
                              label="Status"
                              value={safeText(item.status)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                    No items found on this order.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="h-5 w-5 text-zinc-400" />
                  Shipping Information
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
                <InfoRow
                  icon={MapPin}
                  label="Address"
                  value={[
                    shippingAddress.street,
                    shippingAddress.city,
                    shippingAddress.state,
                    shippingAddress.zipCode,
                    shippingAddress.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Not provided"}
                />
                <InfoRow
                  icon={User}
                  label="Recipient"
                  value={
                    [
                      shippingAddress.firstName,
                      shippingAddress.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ") || "Not provided"
                  }
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={safeText(shippingAddress.phone)}
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={safeText(shippingAddress.email)}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pt-6 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span>{(order as any).shippingCost != null ? formatPrice((order as any).shippingCost) : "Not provided"}</span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Tax</span>
                  <span>{(order as any).taxAmount != null ? formatPrice((order as any).taxAmount) : "Not provided"}</span>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.total ?? subtotal)}</span>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    Payment Method
                  </p>
                  <p className="mt-2 text-sm text-white">
                    {payment.type
                      ? `${payment.type}${payment.last4 ? ` •••• ${payment.last4}` : ""}`
                      : "Not provided"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-lg">Order Notes</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pt-6 text-sm text-zinc-400">
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-amber-400" />
                  <p>
                    {note ? note : "No additional customer note was added to this order."}
                  </p>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <HelpCircle className="mt-0.5 h-4 w-4 text-sky-400" />
                  <p>
                    {tracking.trackingNumber || tracking.carrier
                      ? `Tracking${tracking.carrier ? ` with ${tracking.carrier}` : ""}${tracking.trackingNumber ? ` • ${tracking.trackingNumber}` : ""}`
                      : "Tracking information is not available yet."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3">
              <Button className="w-full rounded-2xl bg-white font-semibold text-black hover:bg-zinc-200">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>

              <Button variant="outline" className="w-full rounded-2xl border-white/10 bg-transparent">
                <Copy className="mr-2 h-4 w-4" />
                Copy Order ID
              </Button>

              <Button variant="outline" className="w-full rounded-2xl border-white/10 bg-transparent">
                <HelpCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>

              {canCancel && (
                <Button 
                  variant="outline" 
                  className="w-full rounded-2xl border-red-500/20 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  onClick={() => setShowCancelDialog(true)} 
                  disabled={isCancelling}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Drop this right before the final two closing </div> tags */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="border-white/10 bg-[#121214] text-white rounded-2xl max-w-md p-6 shadow-2xl">
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="text-xl font-semibold text-white tracking-tight">
              Cancel this order?
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-400 leading-relaxed">
              Are you sure you want to cancel this order? This will immediately halt fulfillment operations and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-6 flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-white/5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCancelDialog(false)}
              disabled={isCancelling}
              className="rounded-xl border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 font-medium px-4"
            >
              Keep Order
            </Button>
            <Button
              type="button"
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="rounded-xl bg-[#DB4444] text-white hover:bg-[#c53a3a] font-medium px-4 flex items-center justify-center min-w-[120px]"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm Cancel"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}