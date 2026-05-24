import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import AccountSectionCard from "../shared/AccountSectionCard";
import AccountSectionTitle from "../shared/AccountSectionTitle";
import type { AccountRecentOrder } from "../../types/account-home.types";

type Props = {
  orders: AccountRecentOrder[];
};

export default function RecentOrdersSection({ orders }: Props) {
  return (
    <AccountSectionCard>
      <AccountSectionTitle
        title="Recent Orders"
        description="Your latest purchases at a glance."
      />

      <div className="space-y-4 pt-5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-white">{order.title}</p>
                <span className="text-xs text-zinc-500">{order.id}</span>
              </div>
              <p className="text-sm text-zinc-400">Ordered on {order.date}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold text-white">{order.amount}</p>
                <p className="text-sm text-zinc-400">{order.status}</p>
              </div>

              <Button
                asChild
                variant="secondary"
                className="rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Link to={order.href}>
                  Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AccountSectionCard>
  );
}