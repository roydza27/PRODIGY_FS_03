import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import AdminPageShell from "../components/AdminPageShell";

const stats = [
  { label: "Total Revenue", value: "₹4.2L" },
  { label: "Orders", value: "1,284" },
  { label: "Products", value: "148" },
  { label: "Customers", value: "892" },
];

const recentActivity = [
  "New order placed for Smart Watch",
  "Inventory updated for Headphones",
  "Customer support ticket resolved",
  "Product review approved",
];

export default function AdminDashboardPage() {
  return (
    <AdminPageShell
      title="Dashboard"
      description="Monitor store health, sales performance, and operational activity."
      actions={<Button className="rounded-xl bg-red-500 hover:bg-red-600">Refresh</Button>}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{stat.value}</CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-end gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              {[35, 58, 44, 72, 61, 83, 66].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-xl bg-red-500/80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-zinc-400">
              Placeholder chart for weekly revenue and order volume.
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((item, index) => (
              <div key={item}>
                <div className="flex items-start gap-3">
                  <Badge className="mt-0.5 bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                    {index + 1}
                  </Badge>
                  <p className="text-sm text-zinc-300">{item}</p>
                </div>
                {index < recentActivity.length - 1 ? (
                  <Separator className="my-4 bg-white/10" />
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
}