import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const shipments = [
  { id: "SHP-101", carrier: "Delhivery", status: "In Transit" },
  { id: "SHP-102", carrier: "Blue Dart", status: "Packed" },
  { id: "SHP-103", carrier: "XpressBees", status: "Delivered" },
];

export default function AdminShipmentsPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Shipments</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Track packing, dispatch, and delivery status across orders.
            </p>
          </div>
          <Button className="rounded-xl bg-red-500 hover:bg-red-600">Dispatch</Button>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Shipment Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{shipment.id}</p>
                  <p className="mt-1 text-sm text-zinc-400">{shipment.carrier}</p>
                </div>
                <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                  {shipment.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}