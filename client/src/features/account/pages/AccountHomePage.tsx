import { ArrowRight, Heart, Headphones, Package, UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const stats = [
  { label: "Total Orders", value: "12", icon: Package },
  { label: "Wishlist Items", value: "8", icon: Heart },
  { label: "Support Tickets", value: "2", icon: Headphones },
  { label: "Account Status", value: "Active", icon: UserCircle2 },
];

const recentOrders = [
  {
    id: "ORD-1024",
    title: "Noise Cancelling Headphones",
    date: "17 May 2026",
    status: "Delivered",
    amount: "₹5,499",
  },
  {
    id: "ORD-1023",
    title: "Smart Watch",
    date: "12 May 2026",
    status: "Shipped",
    amount: "₹7,999",
  },
  {
    id: "ORD-1022",
    title: "Gaming Mouse",
    date: "09 May 2026",
    status: "Processing",
    amount: "₹1,499",
  },
];

const wishlistPreview = [
  "Wireless Keyboard",
  "Smart Watch",
  "Backpack",
  "Gaming Mouse",
];

export default function AccountHomePage() {
  return (
    <div className="min-h-screen bg-[#09090B] px-4 py-8 text-white md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[28px] border border-white/10 bg-[#111113] p-6 shadow-2xl shadow-black/30 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge className="w-fit border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/5">
                Customer Account
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">
                  Welcome back, John.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
                  Manage your orders, wishlist, profile settings, and support requests from one clean dashboard.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="rounded-2xl bg-[#DB4444] px-5 text-white hover:bg-[#c53a3a]">
                Continue shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                className="rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                View orders
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.label} className="border-white/10 bg-[#111113] text-white shadow-xl shadow-black/20">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Icon className="h-5 w-5 text-[#DB4444]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
          <Card className="border-white/10 bg-[#111113] text-white shadow-2xl shadow-black/20">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-xl tracking-[-0.03em]">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              {recentOrders.map((order) => (
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
                      variant="secondary"
                      className="rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-[#111113] text-white shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="text-xl tracking-[-0.03em]">Wishlist Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-5">
                {wishlistPreview.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <span className="text-sm text-zinc-200">{item}</span>
                    <Heart className="h-4 w-4 text-[#DB4444]" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#111113] text-white shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="text-xl tracking-[-0.03em]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-5">
                <Link
                  to="/account/profile"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition-colors hover:bg-white/10"
                >
                  <span>Edit profile</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/account/orders"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition-colors hover:bg-white/10"
                >
                  <span>Track orders</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/support"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition-colors hover:bg-white/10"
                >
                  <span>Contact support</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
