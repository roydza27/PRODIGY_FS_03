import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Support</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Reach out to support or search for answers quickly.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Open a Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Subject" className="border-white/10 bg-black/20 text-white" />
              <Input placeholder="Order ID (optional)" className="border-white/10 bg-black/20 text-white" />
              <textarea
                placeholder="Describe your issue..."
                className="min-h-32 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
              />
              <Button className="rounded-xl bg-red-500 hover:bg-red-600">Submit Ticket</Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Contact Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              <p>Email: support@example.com</p>
              <p>Phone: +91 98765 43210</p>
              <p>Hours: Mon–Sat, 9:00 AM – 7:00 PM</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}