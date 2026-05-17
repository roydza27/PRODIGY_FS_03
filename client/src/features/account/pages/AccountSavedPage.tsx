import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const savedItems = [
  { label: "Home Address", value: "123 MG Road, Bengaluru" },
  { label: "Office Address", value: "Indiranagar, Bengaluru" },
  { label: "Default Payment", value: "Visa ending in 4242" },
];

export default function AccountSavedPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Saved Items</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Saved addresses, payment preferences, and quick checkout details.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {savedItems.map((item) => (
            <Card key={item.label} className="border-white/10 bg-white/5 text-white">
              <CardHeader className="space-y-3">
                <Badge className="w-fit bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                  Saved
                </Badge>
                <CardTitle className="text-lg">{item.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-400">{item.value}</p>
                <Button variant="outline" className="w-full rounded-xl border-white/10 bg-transparent hover:bg-white/5">
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}