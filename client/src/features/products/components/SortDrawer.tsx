import { ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

type SortValue = "newest" | "price-asc" | "price-desc" | "name-asc";

const sortOptions: { label: string; value: SortValue }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

export default function SortDrawer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = (searchParams.get("sort") || "newest") as SortValue;

  const setSort = (value: SortValue) => {
    const next = new URLSearchParams(searchParams);
    next.set("sort", value);
    setSearchParams(next, { replace: true });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="h-11 shrink-0 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
        >
          <ChevronDown className="mr-2 size-4" />
          Sort
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="border-white/10 bg-[#111113] text-white"
      >
        <SheetHeader className="border-b border-white/10 pb-4">
          <SheetTitle className="text-white">Sort products</SheetTitle>
        </SheetHeader>

        <div className="mt-4 grid gap-2">
          {sortOptions.map((option) => {
            const active = currentSort === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSort(option.value)}
                className={[
                  "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
                  active
                    ? "border-red-500 bg-red-500/10 text-white"
                    : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10",
                ].join(" ")}
              >
                <span>{option.label}</span>
                {active ? (
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                ) : null}
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}