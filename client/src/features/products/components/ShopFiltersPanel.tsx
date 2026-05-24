import { useSearchParams } from "react-router-dom";
import {
  IconDiscount2,
  IconSparkles,
  IconStar,
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
  { label: "All", value: "" },
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
  { label: "4.0+", value: "4" },
  { label: "4.5+", value: "4.5" },
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
      <CardHeader className="border-b border-white/10">
        <CardTitle className="flex items-center gap-2 text-base">
          <IconSparkles className="size-4 text-white/80" />
          Filters & sorting
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
            Search
          </p>
          <ProductSearchBar
            value={search}
            onChange={(value) => setParam("q", value)}
            placeholder="Search products..."
          />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
            Quick filters
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
                    "flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm transition",
                    active
                      ? "border-white/12 bg-white/10 text-white"
                      : "border-white/8 bg-white/5 text-white/65 hover:border-white/12 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex size-8 items-center justify-center rounded-xl",
                      active ? "bg-white/10" : "bg-white/5",
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

        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
            Categories
          </p>
          <div className="space-y-1.5">
            {categories.map((item) => {
              const active = category === item.value;

              return (
                <button
                  key={item.value || "all"}
                  type="button"
                  onClick={() => setParam("category", item.value)}
                  className={[
                    "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm transition ring-1 ring-inset",
                    active
                      ? "bg-white/10 text-white ring-white/12"
                      : "bg-transparent text-white/60 ring-transparent hover:bg-white/5 hover:text-white hover:ring-white/8",
                  ].join(" ")}
                >
                  <span className="font-medium">{item.label}</span>
                  {active ? <span className="h-2 w-2 rounded-full bg-red-500" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
            Price range
          </p>
          <div className="space-y-1.5">
            {priceBands.map((item) => {
              const active = price === item.value;

              return (
                <button
                  key={item.value || "any"}
                  type="button"
                  onClick={() => setParam("price", item.value)}
                  className={[
                    "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm transition",
                    active
                      ? "bg-white/10 text-white"
                      : "bg-white/4 text-white/65 hover:bg-white/6 hover:text-white",
                  ].join(" ")}
                >
                  <span className="font-medium">{item.label}</span>
                  {active ? <span className="h-2 w-2 rounded-full bg-emerald-400" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
            Customer rating
          </p>
          <div className="space-y-1.5">
            {ratings.map((item) => {
              const active = rating === item.value;

              return (
                <button
                  key={item.value || "any-rating"}
                  type="button"
                  onClick={() => setParam("rating", item.value)}
                  className={[
                    "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm transition",
                    active
                      ? "bg-white/10 text-white"
                      : "bg-white/4 text-white/65 hover:bg-white/6 hover:text-white",
                  ].join(" ")}
                >
                  <span className="font-medium">{item.label}</span>
                  {item.value ? <span className="h-2 w-2 rounded-full bg-amber-400" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
            Sort by
          </p>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-2">
            <ProductSortSelect
              value={sortBy}
              onChange={(value) => setParam("sort", value)}
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={clearFilters}
          className="h-11 w-full rounded-2xl bg-red-500 font-medium text-white hover:bg-red-600"
        >
          Clear filters
        </Button>
      </CardContent>
    </Card>
  );
}