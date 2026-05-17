import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const customers = [
  { name: "Royal D Souza", email: "royal@example.com", orders: 12, status: "Active" },
  { name: "Aanya Verma", email: "aanya@example.com", orders: 8, status: "Active" },
  { name: "Kabir Singh", email: "kabir@example.com", orders: 3, status: "New" },
];

export default function AdminCustomersPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Customers</h1>
            <p className="mt-1 text-sm text-zinc-400">
              View customer activity, order count, and account health.
            </p>
          </div>
          <Button className="rounded-xl bg-red-500 hover:bg-red-600">Export</Button>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customers.map((customer) => (
              <div
                key={customer.email}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{customer.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                    {customer.status}
                  </Badge>
                  <p className="text-sm text-zinc-300">{customer.orders} orders</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}