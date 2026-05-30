import { Download, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

const invoices = [
  { id: "INV-101", date: "May 17, 2026", amount: "₹15,998", status: "paid" },
  { id: "INV-102", date: "May 12, 2026", amount: "₹7,999", status: "paid" },
  { id: "INV-103", date: "May 08, 2026", amount: "₹5,499", status: "refunded" },
  { id: "INV-104", date: "April 20, 2026", amount: "₹2,100", status: "pending" },
];

export default function AccountInvoicesPage() {
  return (
    <div className="min-h-screen bg-[#111113] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8 text-left">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>
          <p className="text-zinc-400">View your payment history and download invoices for your records.</p>
        </div>

        {/* Invoice Table Card */}
        <Card className="border-white/10 bg-[#18181B] shadow-none">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription className="text-zinc-400">Recent billing activity</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input 
                  placeholder="Search invoices..." 
                  className="h-9 w-full rounded-lg border border-white/10 bg-black/20 pl-9 pr-4 text-sm outline-none focus:border-[#DB4444]/50 sm:w-64"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-zinc-500 uppercase text-[10px] tracking-wider">
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 font-semibold">Invoice ID</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{invoice.id}</td>
                      <td className="px-6 py-4 text-zinc-400">{invoice.date}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`capitalize rounded-full px-2.5 py-0.5 text-[11px] font-medium 
                          ${invoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            invoice.status === 'refunded' ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-semibold">{invoice.amount}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10">
                          <Download className="mr-2 h-3.5 w-3.5" />
                          PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}