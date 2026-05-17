import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

const events = [
  { title: "Order placed", meta: "May 17, 2026 · Order #ORD-1001" },
  { title: "Payment confirmed", meta: "May 17, 2026 · COD" },
  { title: "Order shipped", meta: "May 18, 2026 · Dispatched" },
  { title: "Delivered", meta: "May 20, 2026 · Signed by customer" },
];

export default function AccountHistoryPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Purchase History</h1>
          <p className="mt-1 text-sm text-zinc-400">
            A simple timeline of your recent account activity and purchases.
          </p>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.map((event, index) => (
              <div key={event.title}>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-medium">{event.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{event.meta}</p>
                </div>
                {index < events.length - 1 ? <Separator className="my-4 bg-white/10" /> : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}