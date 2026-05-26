"use client";

import { useEffect, useMemo, useState } from "react";
import { orderService } from "../services/order.service";
import type { Order } from "../types/order.types";
import { formatPrice } from "@/features/products/utils/product.helpers";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  Package2,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import AccountOrdersHeader from "../components/account-orders/AccountOrdersHeader";
import OrdersListSection from "../components/account-orders/OrdersListSection";
import { Button } from "@/shared/components/ui/button";

const ORDER_STATUSES = ["all", "delivered", "processing", "shipped"] as const;

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<(typeof ORDER_STATUSES)[number]>("all");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await orderService.getAll();
        setOrders(res.orders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const counts = useMemo(() => {
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const processing = orders.filter((o) => o.status === "processing").length;
    const shipped = orders.filter((o) => o.status === "shipped").length;
    const inTransit = processing + shipped;
    const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      all: orders.length,
      delivered,
      processing,
      shipped,
      inTransit,
      totalSpent,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div className="min-h-screen bg-[#111113]/95 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 text-left">
        <div className="mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(219,68,68,0.16),rgba(255,255,255,0.04)_45%,rgba(255,255,255,0.02))] shadow-2xl shadow-black/25">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>

              <AccountOrdersHeader />

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                Track every purchase, check delivery progress, and review your
                order history in one organized place.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-zinc-300">
                  <Package2 className="h-4 w-4 text-zinc-400" />
                  <span>
                    {counts.all} order{counts.all !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-zinc-300">
                  <Truck className="h-4 w-4 text-zinc-400" />
                  <span>{counts.inTransit} in transit</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                  <span>{counts.delivered} delivered</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-5 shadow-xl shadow-black/20">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <ShoppingBag className="h-5 w-5 text-zinc-200" />
                </div>

                <div>
                  <p className="text-base font-semibold text-white">
                    Order history
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    Review shipping status, revisit completed purchases, and
                    keep your buying history organized.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <ShieldCheck className="h-4.5 w-4.5 text-zinc-300" />
                  </div>
                  <p className="text-sm font-medium text-zinc-200">Secure</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Protected order access
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <Truck className="h-4.5 w-4.5 text-zinc-300" />
                  </div>
                  <p className="text-sm font-medium text-zinc-200">Delivery</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Follow shipping updates
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <Clock3 className="h-4.5 w-4.5 text-zinc-300" />
                  </div>
                  <p className="text-sm font-medium text-zinc-200">Recent</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Updated from your account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {ORDER_STATUSES.map((status) => {
                const active = statusFilter === status;
                const count =
                  status === "all"
                    ? counts.all
                    : status === "delivered"
                      ? counts.delivered
                      : status === "processing"
                        ? counts.processing
                        : counts.shipped;

                return (
                  <Button
                    key={status}
                    type="button"
                    variant="ghost"
                    onClick={() => setStatusFilter(status)}
                    className={[
                      "h-11 rounded-2xl px-4 text-sm capitalize transition",
                      active
                        ? "bg-[#DB4444] text-white hover:bg-[#c53a3a]"
                        : "border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/5 hover:text-white",
                    ].join(" ")}
                  >
                    <span>{status}</span>
                    <span
                      className={[
                        "ml-2 rounded-full px-2 py-0.5 text-xs",
                        active
                          ? "bg-white/15 text-white"
                          : "bg-white/5 text-zinc-400",
                      ].join(" ")}
                    >
                      {count}
                    </span>
                  </Button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                <Search className="h-4 w-4 text-zinc-500" />
                <span>{filteredOrders.length} visible</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                <span className="text-zinc-500">Total spent</span>
                <span className="font-medium text-white">
                  {formatPrice(counts.totalSpent)}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                <Clock3 className="h-4 w-4 text-zinc-500" />
                <span>Sorted by newest</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white/[0.04] p-1 shadow-2xl shadow-black/20">
          <div className="rounded-[1.6rem] bg-[#111113]">
            <OrdersListSection
              orders={filteredOrders}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}