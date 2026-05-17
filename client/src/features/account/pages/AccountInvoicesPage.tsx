import { Link } from "react-router-dom";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const invoices = [
  { id: "INV-101", date: "May 17, 2026", amount: "₹15,998", status: "Paid" },
  { id: "INV-102", date: "May 12, 2026", amount: "₹7,999", status: "Paid" },
  { id: "INV-103", date: "May 08, 2026", amount: "₹5,499", status: "Refunded" },
];

export default function AccountInvoicesPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Invoices</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Download and review billing records for your orders.
          </p>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-zinc-400">{invoice.date}</p>
                </div>

                <div className="flex items-center gap-4">
                  <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                    {invoice.status}
                  </Badge>
                  <p className="text-sm font-semibold">{invoice.amount}</p>
                  <Button asChild className="rounded-xl bg-red-500 hover:bg-red-600">
                    <Link to="#">Download</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}