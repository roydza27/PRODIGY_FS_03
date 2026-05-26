import { useMemo } from "react";
import {
  CheckCircle2,
  CircleDashed,
  Clock3,
  CreditCard,
  House,
  Package,
  ShieldCheck,
  Truck,
  XCircle,
} from "lucide-react";
import type { Order } from "@/features/account/types/order.types";

type OrderStep = {
  key: "pending" | "paid" | "processing" | "shipped" | "delivered";
  label: string;
  description: string;
  icon: React.ElementType;
};

const ORDER_STEPS: OrderStep[] = [
  { key: "pending", label: "Pending", description: "Order received", icon: Clock3 },
  { key: "paid", label: "Paid", description: "Payment confirmed", icon: CreditCard },
  { key: "processing", label: "Processing", description: "Preparing items", icon: ShieldCheck },
  { key: "shipped", label: "Shipped", description: "On the way", icon: Truck },
  { key: "delivered", label: "Delivered", description: "Completed", icon: House },
];

function normalizeStatus(status: string) {
  return (status || "").toLowerCase().trim();
}

function getCurrentStep(status: string) {
  const normalized = normalizeStatus(status);
  const idx = ORDER_STEPS.findIndex((step) => step.key === normalized);
  return idx === -1 ? 0 : idx;
}

function formatDate(value?: string | Date) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value?: string | Date) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getPaymentLabel(method?: string) {
  const normalized = (method || "").toLowerCase();
  if (normalized === "cod") return "Cash on delivery";
  if (normalized === "card") return "Card payment";
  return "Not provided";
}

export default function ShippingTracker({ order }: { order: Order }) {
  const status = normalizeStatus(order.status);

  const isCancelled = status === "cancelled";
  const currentStep = useMemo(() => getCurrentStep(status), [status]);

  const progress =
    isCancelled ? 0 : (currentStep / (ORDER_STEPS.length - 1)) * 100;

  const itemCount =
    order.items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 0;

  const shippingAddress = order.shippingAddress as any;

  const addressLine = [
    shippingAddress?.address,
    shippingAddress?.city,
    shippingAddress?.state,
    shippingAddress?.postalCode,
    shippingAddress?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Truck className="h-4 w-4 text-[#DB4444]" />
            Order progress
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-[#111113] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
              #{String(order._id).slice(-8).toUpperCase()}
            </span>

            <span
              className={[
                "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                isCancelled
                  ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
                  : "border-[#DB4444]/20 bg-[#DB4444]/10 text-[#FF8A8A]",
              ].join(" ")}
            >
              {isCancelled ? "Cancelled" : order.status}
            </span>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Placed on {formatDate(order.createdAt)} · Updated{" "}
            {formatDateTime((order as any).updatedAt || order.createdAt)}
          </p>
        </div>

        <div className="grid gap-2 text-xs text-zinc-500 sm:text-right">
          <div>
            Payment:{" "}
            <span className="text-zinc-300">
              {getPaymentLabel((order as any).paymentMethod)}
            </span>
          </div>
          <div>
            Items: <span className="text-zinc-300">{itemCount}</span>
          </div>
          <div>
            Total:{" "}
            <span className="text-zinc-300">
              {(order.total ?? 0).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#111113] p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-zinc-300">Order timeline</p>
            <p className="mt-1 text-xs text-zinc-500">
              {isCancelled
                ? "This order was cancelled."
                : "Progress reflects the live backend status."}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-zinc-500">Completion</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {isCancelled ? "0%" : `${Math.round(progress)}%`}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-4 h-0.5 rounded-full bg-white/10" />
          <div
            className={[
              "absolute left-0 top-4 h-0.5 rounded-full transition-all duration-700 ease-out",
              isCancelled ? "bg-rose-500" : "bg-[#DB4444]",
            ].join(" ")}
            style={{ width: `${progress}%` }}
          />

          <div className="relative grid grid-cols-5 gap-2">
            {ORDER_STEPS.map((step, index) => {
              const done = !isCancelled && index <= currentStep;
              const active = !isCancelled && index === currentStep;
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300",
                      done
                        ? "border-[#DB4444] bg-[#DB4444] text-white shadow-[0_0_0_4px_rgba(219,68,68,0.10)]"
                        : "border-white/10 bg-[#111113] text-zinc-500",
                      active ? "scale-105" : "",
                    ].join(" ")}
                  >
                    {done ? (
                      index < currentStep ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )
                    ) : (
                      <CircleDashed className="h-4 w-4" />
                    )}
                  </div>

                  <div className="mt-3 space-y-1">
                    <p
                      className={[
                        "text-[11px] font-semibold uppercase tracking-[0.18em]",
                        done ? "text-white" : "text-zinc-500",
                      ].join(" ")}
                    >
                      {step.label}
                    </p>
                    <p className="text-[11px] leading-4 text-zinc-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isCancelled ? (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium text-rose-200">Order cancelled</p>
              <p className="mt-1 text-rose-300/80">
                This order did not continue through the delivery flow.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
        <InfoChip label="Full name" value={shippingAddress?.fullName || "Not provided"} />
        <InfoChip label="Phone" value={shippingAddress?.phone || "Not provided"} />
        <InfoChip label="Address" value={addressLine || "Not provided"} />
      </div>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-1 text-sm text-white">{value}</p>
    </div>
  );
}