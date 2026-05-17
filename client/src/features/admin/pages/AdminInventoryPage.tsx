import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const stockItems = [
  { name: "Smart Watch", stock: 12, status: "Healthy" },
  { name: "Keyboard", stock: 6, status: "Low Stock" },
  { name: "Monitor", stock: 2, status: "Critical" },
];

export default function AdminInventoryPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Track stock levels, low inventory alerts, and restock needs.
            </p>
          </div>
          <Button className="rounded-xl bg-red-500 hover:bg-red-600">Restock</Button>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stockItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">Stock: {item.stock}</p>
                </div>
                <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}