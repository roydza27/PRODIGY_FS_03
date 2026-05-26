import { useSearchParams } from "react-router-dom";
import { ChevronDown, ArrowDownUp } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import FilterChip from "./FilterChip";
import FiltersDrawer from "./FiltersDrawer";

const quickChips = [
  { label: "1 Day Delivery", key: "freeShipping", value: "1" },
  { label: "Top Rated", key: "rating", value: "4.5" },
  { label: "On Sale", key: "onSale", value: "1" },
  { label: "Electronics", key: "category", value: "electronics" },
  { label: "Fashion", key: "category", value: "fashion" },
] as const;

type SortValue = "newest" | "price-asc" | "price-desc" | "name-asc";

const sortOptions: { label: string; value: SortValue }[] = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

export default function MobileFiltersBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = (searchParams.get("sort") || "newest") as SortValue;

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || "Sort";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const toggleParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (next.get(key) === value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="space-y-3 lg:hidden">
      {/* Hide scrollbar with CSS if possible, but keep it scrollable */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        
        {/* Fixed: Now a functional Dropdown instead of a dead button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="shrink-0 rounded-full border border-white/10 bg-[#111113] text-white hover:bg-white/10"
            >
              <ArrowDownUp className="mr-2 size-4 text-[#DB4444]" />
              {currentSortLabel}
              <ChevronDown className="ml-2 size-4 text-zinc-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 rounded-xl border-white/10 bg-[#111113] text-white">
            {sortOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setParam("sort", opt.value)}
                className={`cursor-pointer rounded-lg focus:bg-white/10 ${sortBy === opt.value ? "text-[#DB4444] font-medium" : "text-zinc-300"}`}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <FiltersDrawer />

        {Array.from(searchParams.keys()).length > 0 && (
          <Button
            type="button"
            variant="ghost"
            onClick={clearFilters}
            className="shrink-0 rounded-full text-[#DB4444] hover:bg-[#DB4444]/10 hover:text-[#DB4444]"
          >
            Reset All
          </Button>
        )}

        {quickChips.map((chip) => {
          const active = searchParams.get(chip.key) === chip.value;
          return (
            <FilterChip
              key={`${chip.key}-${chip.value}`}
              label={chip.label}
              active={active}
              onClick={() => toggleParam(chip.key, chip.value)}
            />
          );
        })}
      </div>
    </div>
  );
}