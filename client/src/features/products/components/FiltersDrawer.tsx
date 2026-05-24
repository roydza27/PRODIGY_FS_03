import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductSearchBar from "./ProductSearchBar";

import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

import FilterChip from "./FilterChip";
import { se } from "date-fns/locale";

const categories = [
  { label: "All", value: "" },
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Home", value: "home" },
  { label: "Beauty", value: "beauty" },
  { label: "Sports", value: "sports" },
  { label: "Books", value: "books" },
];

const priceBands = [
  { label: "Any price", value: "" },
  { label: "Under ₹2,000", value: "budget" },
  { label: "₹2,000 - ₹5,000", value: "mid" },
  { label: "₹5,000+", value: "premium" },
];

const ratings = [
  { label: "Any rating", value: "" },
  { label: "4.0+", value: "4" },
  { label: "4.5+", value: "4.5" },
];

const quickFilters = [
  { label: "1 Day Delivery", key: "freeShipping", value: "1" },
  { label: "Top Rated", key: "rating", value: "4.5" },
  { label: "On Sale", key: "onSale", value: "1" },
  { label: "In Stock", key: "inStock", value: "1" },
] as const;

type SortValue =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc";

export default function FiltersDrawer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [draftParams, setDraftParams] = React.useState(
    new URLSearchParams(searchParams)
  );

  React.useEffect(() => {
    setDraftParams(new URLSearchParams(searchParams));
  }, [searchParams]);

  const category = draftParams.get("category") || "";
  const price = draftParams.get("price") || "";
  const rating = draftParams.get("rating") || "";

  const sortBy = (
    draftParams.get("sort") || "newest"
  ) as SortValue;

  const inStock = draftParams.get("inStock") === "1";
  const onSale = draftParams.get("onSale") === "1";
  const freeShipping =
    draftParams.get("freeShipping") === "1";

  const setDraftParam = (
    key: string,
    value: string
  ) => {
    const next = new URLSearchParams(draftParams);

    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setDraftParams(next);
  };

  const toggleDraftParam = (
    key: string,
    value: string
  ) => {
    const next = new URLSearchParams(draftParams);

    if (next.get(key) === value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setDraftParams(next);
  };

  const clearFilters = () => {
    setDraftParams(new URLSearchParams());
    setSearchParams({}, { replace: true });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="h-11 shrink-0 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
        >
          <SlidersHorizontal className="mr-2 size-4" />
          Filter
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="max-h-[85vh] border-white/10 bg-[#111113] text-white"
      >
        <SheetHeader className="border-b border-white/10 pb-4">
          <SheetTitle className="text-white">
            Filters
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-5 overflow-y-auto pr-1 pb-28">
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Search
            </p>

            <ProductSearchBar
              value={draftParams.get("q") || ""}
              onChange={(value) => setDraftParam("q", value)}
              placeholder="Search products..."
            />
          </section>
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Quick filters
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickFilters.map((chip) => {
                const active =
                  (chip.key === "inStock" &&
                    inStock) ||
                  (chip.key === "onSale" &&
                    onSale) ||
                  (chip.key === "freeShipping" &&
                    freeShipping);

                return (
                  <FilterChip
                    key={chip.key}
                    label={chip.label}
                    active={active}
                    onClick={() =>
                      toggleDraftParam(
                        chip.key,
                        chip.value
                      )
                    }
                  />
                );
              })}
            </div>
          </section>

          {/* CATEGORIES */}
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Categories
            </p>

            <div className="grid gap-2">
              {categories.map((item) => {
                const active =
                  category === item.value;

                return (
                  <button
                    key={item.value || "all"}
                    type="button"
                    onClick={() =>
                      setDraftParam(
                        "category",
                        item.value
                      )
                    }
                    className={[
                      "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
                      active
                        ? "border-red-500 bg-red-500/10 text-white"
                        : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>

                    {active ? (
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          {/* PRICE */}
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Price range
            </p>

            <div className="grid gap-2">
              {priceBands.map((item) => {
                const active =
                  price === item.value;

                return (
                  <button
                    key={item.value || "any"}
                    type="button"
                    onClick={() =>
                      setDraftParam(
                        "price",
                        item.value
                      )
                    }
                    className={[
                      "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
                      active
                        ? "border-red-500 bg-red-500/10 text-white"
                        : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>

                    {active ? (
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          {/* RATING */}
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Rating
            </p>

            <div className="grid gap-2">
              {ratings.map((item) => {
                const active =
                  rating === item.value;

                return (
                  <button
                    key={item.value || "rating"}
                    type="button"
                    onClick={() =>
                      setDraftParam(
                        "rating",
                        item.value
                      )
                    }
                    className={[
                      "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
                      active
                        ? "border-red-500 bg-red-500/10 text-white"
                        : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>

                    {active ? (
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SORT */}
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Sort
            </p>

            <div className="grid gap-2">
              {[
                {
                  label: "Newest",
                  value: "newest",
                },
                {
                  label: "Price: Low to High",
                  value: "price-asc",
                },
                {
                  label: "Price: High to Low",
                  value: "price-desc",
                },
                {
                  label: "Name: A to Z",
                  value: "name-asc",
                },
              ].map((item) => {
                const active =
                  sortBy === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setDraftParam(
                        "sort",
                        item.value
                      )
                    }
                    className={[
                      "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
                      active
                        ? "border-red-500 bg-red-500/10 text-white"
                        : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>

                    {active ? (
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* ACTIONS */}
        <div className="sticky bottom-0 mt-4 flex gap-3 border-t border-white/10 bg-[#111113] pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            className="h-11 flex-1 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            Reset
          </Button>

          <Button
            type="button"
            onClick={() => {
              setSearchParams(draftParams, {
                replace: true,
              });

              setOpen(false);
            }}
            className="h-11 flex-1 rounded-2xl bg-red-500 font-medium text-white hover:bg-red-600"
          >
            Apply filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}