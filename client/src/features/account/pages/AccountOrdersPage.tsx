import { Link } from "react-router-dom";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

const orders = [
  {
    id: "ORD-1001",
    date: "May 17, 2026",
    status: "Delivered",
    total: "₹15,998",
    items: 2,
  },
  {
    id: "ORD-1002",
    date: "May 12, 2026",
    status: "Shipped",
    total: "₹7,999",
    items: 1,
  },
  {
    id: "ORD-1003",
    date: "May 08, 2026",
    status: "Processing",
    total: "₹5,499",
    items: 1,
  },
];

export default function AccountOrdersPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Track your recent purchases, status updates, and order history.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">12</CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                In Transit
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">3</CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">₹48,796</CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orders.map((order, index) => (
              <div key={order.id}>
                <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{order.id}</p>
                      <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-400">
                      {order.date} · {order.items} item{order.items > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold text-zinc-100">
                      {order.total}
                    </p>
                    <Button
                      asChild
                      className="rounded-xl bg-red-500 text-white hover:bg-red-600"
                    >
                      <Link to="#">View details</Link>
                    </Button>
                  </div>
                </div>
                {index < orders.length - 1 ? <Separator className="my-4 bg-white/10" /> : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}