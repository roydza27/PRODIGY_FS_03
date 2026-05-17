import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const reports = [
  "Monthly sales summary",
  "Refund and returns report",
  "Top-selling products report",
  "Inventory audit report",
];

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Reports</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Generate business reports and review store summaries.
            </p>
          </div>
          <Button className="rounded-xl bg-red-500 hover:bg-red-600">Generate Report</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <Card key={report} className="border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-lg">{report}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-400">
                  Placeholder summary block for downloadable operational reports.
                </p>
                <Button variant="outline" className="rounded-xl border-white/10 bg-transparent hover:bg-white/5">
                  View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}