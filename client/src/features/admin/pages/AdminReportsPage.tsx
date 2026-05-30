import { useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
  Download,
  FileBarChart2,
  FileText,
  Package,
  RefreshCw,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Wallet,
} from "lucide-react";

type ReportItem = {
  title: string;
  description: string;
  type: string;
  updated: string;
  status: "ready" | "scheduled" | "needs-review";
};

const reports: ReportItem[] = [
  {
    title: "Monthly sales summary",
    description: "Revenue, order volume, average order value, and growth trends for the selected period.",
    type: "Sales",
    updated: "Updated today",
    status: "ready",
  },
  {
    title: "Refund and returns report",
    description: "Track return reasons, refund value, and high-risk product categories.",
    type: "Operations",
    updated: "Updated 2h ago",
    status: "needs-review",
  },
  {
    title: "Top-selling products report",
    description: "Best performing products ranked by units sold, revenue, and conversion signals.",
    type: "Catalog",
    updated: "Updated today",
    status: "ready",
  },
  {
    title: "Inventory audit report",
    description: "Stock health, low inventory warnings, and products needing restock action.",
    type: "Inventory",
    updated: "Scheduled weekly",
    status: "scheduled",
  },
];

const reportFilters = ["All reports", "Sales", "Operations", "Catalog", "Inventory"] as const;

const stats = [
  {
    label: "Revenue covered",
    value: "₹4.8L",
    change: "+12.4%",
    icon: Wallet,
    accent: "text-emerald-300",
  },
  {
    label: "Orders analyzed",
    value: "1,284",
    change: "+8.1%",
    icon: ShoppingBag,
    accent: "text-blue-300",
  },
  {
    label: "Products tracked",
    value: "186",
    change: "+4.9%",
    icon: Package,
    accent: "text-violet-300",
  },
  {
    label: "Alerts flagged",
    value: "17",
    change: "Needs review",
    icon: ShieldAlert,
    accent: "text-amber-300",
  },
];

function statusBadgeClass(status: ReportItem["status"]) {
  switch (status) {
    case "ready":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "scheduled":
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    case "needs-review":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }
}

export default function AdminReportsPage() {
  const [filter, setFilter] = useState<(typeof reportFilters)[number]>("All reports");

  const filteredReports = useMemo(() => {
    if (filter === "All reports") return reports;
    return reports.filter((report) => report.type === filter);
  }, [filter]);

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6 text-left">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Sparkles className="h-4 w-4 text-[#DB4444]" />
              Reporting center
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Reports</h1>
            <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
              Generate business reports and review store summaries from a cleaner, more professional admin workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-xl border-white/10 bg-black/20 text-white hover:bg-white/5">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button className="rounded-xl bg-[#DB4444] text-white hover:bg-[#c53a3a]">
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-white/10 bg-[#18181B] shadow-xl transition hover:border-white/15 hover:bg-[#1b1b1f]">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{stat.label}</p>
                      <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                      <p className="mt-2 text-sm text-emerald-300">{stat.change}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <Icon className={`h-5 w-5 ${stat.accent}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-white/10 bg-[#18181B] shadow-xl">
          <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_220px] lg:items-center">
            <div>
              <p className="text-sm font-medium text-white">Report workspace</p>
              <p className="mt-1 text-sm text-zinc-400">
                Select a report type to focus on sales, operations, catalog performance, or inventory health.
              </p>
            </div>
            <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
              <SelectTrigger className="h-12 border-white/10 bg-black/20 text-white focus:ring-[#DB4444]">
                <FileBarChart2 className="mr-2 h-4 w-4 text-zinc-500" />
                <SelectValue placeholder="Filter reports" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#18181B] text-white">
                {reportFilters.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredReports.map((report) => (
            <Card key={report.title} className="border-white/10 bg-[#18181B] text-white shadow-xl transition hover:border-white/15 hover:bg-[#1b1b1f]">
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-[#DB4444]/20 bg-[#DB4444]/10 text-[#ffd7d7] hover:bg-[#DB4444]/10">
                    {report.type}
                  </Badge>
                  <Badge className={`border px-3 py-1 ${statusBadgeClass(report.status)}`}>
                    {report.status.replace("-", " ")}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <p className="text-sm text-zinc-400">{report.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <span>{report.updated}</span>
                  <span>Auto-generated</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-xl border-white/10 bg-black/20 text-white hover:bg-white/5">
                    View
                  </Button>
                  <Button className="flex-1 rounded-xl bg-[#DB4444] text-white hover:bg-[#c53a3a]">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/10 bg-[#18181B] shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Reporting Insights</CardTitle>
              <CardDescription className="text-zinc-400">
                Use these reports to make faster catalog and revenue decisions.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {[
                "Revenue reports help identify seasonal spikes and top channels.",
                "Inventory audits reduce stockouts before promotions go live.",
                "Returns analysis reveals product or fulfillment problems early.",
                "Top-seller reports show which products deserve more ad spend.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-300">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#18181B] shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-zinc-400">
                Build the report you need right away.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Monthly sales summary",
                "Refund and returns report",
                "Top-selling products report",
                "Inventory audit report",
              ].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <span className="text-sm text-white">{item}</span>
                  <FileText className="h-4 w-4 text-[#DB4444]" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
