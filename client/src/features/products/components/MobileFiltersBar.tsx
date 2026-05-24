import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
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

export default function MobileFiltersBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = (searchParams.get("sort") || "newest") as SortValue;

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
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <Button
          type="button"
          variant="outline"
          className="shrink-0 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
          onClick={() => setParam("sort", sortBy)}
        >
          <ChevronDown className="mr-2 size-4" />
          Sort: {sortBy}
        </Button>

        <FiltersDrawer />

        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
          className="shrink-0 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
        >
          Reset
        </Button>

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