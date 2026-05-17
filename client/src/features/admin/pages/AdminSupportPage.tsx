import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const tickets = [
  { id: "TCK-101", subject: "Order issue", status: "Open" },
  { id: "TCK-102", subject: "Refund request", status: "In Progress" },
  { id: "TCK-103", subject: "Login help", status: "Resolved" },
];

export default function AdminSupportPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Support</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Monitor and respond to customer support tickets.
            </p>
          </div>
          <Button className="rounded-xl bg-red-500 hover:bg-red-600">New Ticket</Button>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Ticket Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{ticket.id}</p>
                  <p className="mt-1 text-sm text-zinc-400">{ticket.subject}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                    {ticket.status}
                  </Badge>
                  <Button variant="outline" className="rounded-xl border-white/10 bg-transparent hover:bg-white/5">
                    Open
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