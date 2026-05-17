import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import AdminPageShell from "../components/AdminPageShell";

const orders = [
  { id: "ORD-1001", customer: "Royal D Souza", total: "₹15,998", status: "Delivered" },
  { id: "ORD-1002", customer: "Aanya Verma", total: "₹7,999", status: "Shipped" },
  { id: "ORD-1003", customer: "Kabir Singh", total: "₹5,499", status: "Processing" },
];

export default function AdminOrdersPage() {
  return (
    <AdminPageShell
      title="Orders"
      description="Review order status, fulfillment progress, and customer purchases."
    >
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="mt-1 text-sm text-zinc-400">{order.customer}</p>
              </div>

              <div className="flex items-center gap-3">
                <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                  {order.status}
                </Badge>
                <p className="text-sm font-semibold">{order.total}</p>
                <Button className="rounded-xl bg-red-500 hover:bg-red-600">Open</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}