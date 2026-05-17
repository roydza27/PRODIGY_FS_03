import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import AdminPageShell from "../components/AdminPageShell";

const metrics = [
  { label: "Conversion Rate", value: "4.8%" },
  { label: "Avg. Order Value", value: "₹3,249" },
  { label: "Returning Customers", value: "38%" },
  { label: "Bounce Rate", value: "21%" },
];

export default function AdminAnalyticsPage() {
  return (
    <AdminPageShell
      title="Analytics"
      description="Track performance metrics, customer behavior, and store growth."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{metric.value}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Performance Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-80 items-end gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
            {[24, 48, 42, 60, 54, 72, 66, 80].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-xl bg-red-500/80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            Placeholder analytics view for sales and engagement trends.
          </p>
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}