import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

const recentSearches = ["smart watch", "headphones", "keyboard", "monitor"];

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Search products, orders, invoices, and saved items.
          </p>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Search the store</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Search anything..."
                className="border-white/10 bg-black/20 text-white"
              />
              <Button className="rounded-xl bg-red-500 hover:bg-red-600">
                Search
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Recent searches</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    className="rounded-full border-white/10 bg-transparent text-zinc-200 hover:bg-white/5"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}