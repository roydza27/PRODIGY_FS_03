import { useSearchParams } from "react-router-dom";
import {
  IconDiscount2,
  IconSparkles,
  IconTag,
  IconTruck,
} from "@tabler/icons-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import ProductSearchBar from "./ProductSearchBar";
import ProductSortSelect from "./ProductSortSelect";

type SortValue = "newest" | "price-asc" | "price-desc" | "name-asc";
type PriceValue = "" | "budget" | "mid" | "premium";
type RatingValue = "" | "4" | "4.5";

const categories = [
  { label: "All Categories", value: "" },
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Home", value: "home" },
  { label: "Beauty", value: "beauty" },
  { label: "Sports", value: "sports" },
  { label: "Books", value: "books" },
];

const quickFilters = [
  { key: "inStock", label: "In stock", icon: IconTag },
  { key: "onSale", label: "On sale", icon: IconDiscount2 },
  { key: "freeShipping", label: "Free shipping", icon: IconTruck },
] as const;

const priceBands: Array<{ label: string; value: PriceValue }> = [
  { label: "Any price", value: "" },
  { label: "Under ₹2,000", value: "budget" },
  { label: "₹2,000 - ₹5,000", value: "mid" },
  { label: "₹5,000+", value: "premium" },
];

const ratings: Array<{ label: string; value: RatingValue }> = [
  { label: "Any rating", value: "" },
  { label: "4.0+ Stars", value: "4" },
  { label: "4.5+ Stars", value: "4.5" },
];

export default function ShopFiltersPanel() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sortBy = (searchParams.get("sort") || "newest") as SortValue;
  const price = (searchParams.get("price") || "") as PriceValue;
  const rating = (searchParams.get("rating") || "") as RatingValue;

  const inStock = searchParams.get("inStock") === "1";
  const onSale = searchParams.get("onSale") === "1";
  const freeShipping = searchParams.get("freeShipping") === "1";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const toggleParam = (key: string) => {
    const next = new URLSearchParams(searchParams);
    if (next.get(key) === "1") next.delete(key);
    else next.set(key, "1");
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <Card className="border-white/10 bg-[#111113] text-white">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <IconSparkles className="size-4 text-[#DB4444]" />
          Filters & sorting
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Search */}
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Search
          </p>
          <ProductSearchBar
            value={search}
            onChange={(value) => setParam("q", value)}
            placeholder="Search catalog..."
          />
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Quick Status
          </p>
          <div className="grid gap-2">
            {quickFilters.map((item) => {
              const active =
                item.key === "inStock"
                  ? inStock
                  : item.key === "onSale"
                    ? onSale
                    : freeShipping;

              const Icon = item.icon;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleParam(item.key)}
                  className={[
                    "flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-all",
                    active
                      ? "border-[#DB4444]/30 bg-[#DB4444]/10 text-[#DB4444]"
                      : "border-white/5 bg-transparent text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex size-7 items-center justify-center rounded-lg transition-colors",
                      active ? "bg-[#DB4444] text-white" : "bg-white/5",
                    ].join(" ")}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Categories
          </p>
          <div className="space-y-1">
            {categories.map((item) => {
              const active = category === item.value;
              return (
                <button
                  key={item.value || "all"}
                  type="button"
                  onClick={() => setParam("category", item.value)}
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    active
                      ? "bg-white/10 text-white font-medium"
                      : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-[#DB4444]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Price Range
          </p>
          <div className="space-y-1">
            {priceBands.map((item) => {
              const active = price === item.value;
              return (
                <button
                  key={item.value || "any"}
                  type="button"
                  onClick={() => setParam("price", item.value)}
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    active
                      ? "bg-white/10 text-white font-medium"
                      : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-[#DB4444]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Customer Rating
          </p>
          <div className="space-y-1">
            {ratings.map((item) => {
              const active = rating === item.value;
              return (
                <button
                  key={item.value || "any-rating"}
                  type="button"
                  onClick={() => setParam("rating", item.value)}
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    active
                      ? "bg-white/10 text-white font-medium"
                      : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-[#DB4444]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sorting */}
        <div className="space-y-3 pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Sort Order
          </p>
          <div className="rounded-xl border border-white/10 bg-black/20 p-1">
            <ProductSortSelect
              value={sortBy}
              onChange={(value) => setParam("sort", value)}
            />
          </div>
        </div>

        {/* Clear Filters (Only show if filters are applied to save space) */}
        {Array.from(searchParams.keys()).length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <Button
              type="button"
              onClick={clearFilters}
              className="h-11 w-full rounded-xl bg-[#DB4444] font-semibold text-white hover:bg-[#c53a3a]"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}