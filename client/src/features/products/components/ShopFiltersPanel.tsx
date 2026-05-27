import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconDiscount2,
  IconSparkles,
  IconTag,
  IconTruck,
  IconTrash,
  IconChevronDown,
} from "@tabler/icons-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import ProductSearchBar from "./ProductSearchBar";

type SortValue = "newest" | "price-asc" | "price-desc" | "name-asc";
type PriceValue = "" | "budget" | "mid" | "premium";
type RatingValue = "" | "4" | "4.5";

const categories = [
  { label: "All Categories", value: "" },
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Home & Living", value: "home" },
  { label: "Groceries", value: "groceries" },
  { label: "Gaming", value: "gaming" },
  { label: "Health & Beauty", value: "beauty" },
];

const quickFilters = [
  { key: "inStock", label: "In Stock", icon: IconTag },
  { key: "onSale", label: "On Sale", icon: IconDiscount2 },
  { key: "freeShipping", label: "Free Shipping", icon: IconTruck },
] as const;

const priceBands: Array<{ label: string; value: PriceValue }> = [
  { label: "Any Price", value: "" },
  { label: "Under ₹2,000", value: "budget" },
  { label: "₹2,000 - ₹5,000", value: "mid" },
  { label: "Over ₹5,000", value: "premium" },
];

const ratings: Array<{ label: string; value: RatingValue }> = [
  { label: "Any Rating", value: "" },
  { label: "4.0+ Stars", value: "4" },
  { label: "4.5+ Stars", value: "4.5" },
];

// Unified Sort Options Data Mapping Table Array
const sortOptions = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

export default function ShopFiltersPanel() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Component Accordion Toggle States matching your visual layout image bounds
  const [catOpen, setCatOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  // ADDED: Added sorting menu anchor state toggler
  const [sortOpen, setSortOpen] = useState(false);

  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sortBy = (searchParams.get("sort") || "newest") as SortValue;
  const price = (searchParams.get("price") || "") as PriceValue;
  const rating = (searchParams.get("rating") || "") as RatingValue;

  const inStock = searchParams.get("inStock") === "1";
  const onSale = searchParams.get("onSale") === "1";
  const freeShipping = searchParams.get("freeShipping") === "1";

  const hasActiveFilters = Array.from(searchParams.keys()).length > 0;

  // Active Label Track Lookups for Dropdown Preview Windows
  const activeCategoryLabel = categories.find(c => c.value === category)?.label || "All Categories";
  const activePriceLabel = priceBands.find(p => p.value === price)?.label || "Any Price";
  const activeRatingLabel = ratings.find(r => r.value === rating)?.label || "Any Rating";
  // ADDED: Sorting presentation text locator
  const activeSortLabel = sortOptions.find(o => o.value === sortBy)?.label || "Newest Arrivals";

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
    <Card className="border-white/5 bg-[#141416]/95 text-white shadow-2xl backdrop-blur-xl rounded-[24px]">
      <CardHeader className="border-b border-white/5 pb-4">
        <CardTitle className="flex items-center justify-between text-sm font-medium tracking-wide uppercase text-zinc-400">
          <div className="flex items-center gap-2">
            <IconSparkles className="size-4 text-[#DB4444]" />
            <span>Filters & Sorting</span>
          </div>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearFilters}
              className="text-xs font-normal lowercase tracking-normal text-zinc-500 hover:text-[#DB4444] transition-colors"
            >
              reset
            </motion.button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        {/* Search Input Matrix */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Search Catalog
          </p>
          <ProductSearchBar
            value={search}
            onChange={(value) => setParam("q", value)}
            placeholder="Type query name..."
          />
        </div>

        {/* Status Quick Filters Toggle Block */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Quick Status
          </p>
          <div className="flex flex-col gap-1.5">
            {quickFilters.map((item) => {
              const active =
                item.key === "inStock"
                  ? inStock
                  : item.key === "onSale"
                    ? onSale
                    : freeShipping;

              const Icon = item.icon;

              return (
                <motion.button
                  key={item.key}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => toggleParam(item.key)}
                  className={[
                    "flex items-center gap-3 rounded-xl border p-2 text-left text-xs transition-all relative overflow-hidden",
                    active
                      ? "border-[#DB4444]/30 bg-[#DB4444]/5 text-white font-medium shadow-[0_0_20px_rgba(219,68,68,0.05)]"
                      : "border-white/5 bg-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.02] hover:text-zinc-200",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex size-6 shrink-0 items-center justify-center rounded-lg transition-colors",
                      active ? "bg-[#DB4444] text-white" : "bg-white/5",
                    ].join(" ")}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <span className="truncate">{item.label}</span>
                  {active && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#DB4444]" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* CATEGORIES DROP-SELECT COMPONENT ACCORDION */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Catalog Categories
          </p>
          <button
            type="button"
            onClick={() => setCatOpen(!catOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3 py-2.5 text-xs text-zinc-200 hover:border-white/10"
          >
            <span className={category ? "text-white font-medium" : "text-zinc-400"}>{activeCategoryLabel}</span>
            <IconChevronDown className={`size-4 text-zinc-500 transition-transform duration-200 ${catOpen ? "rotate-180 text-[#DB4444]" : ""}`} />
          </button>
          
          <AnimatePresence>
            {catOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-xl border border-white/5 bg-black/40 mt-1"
              >
                <div className="p-1 max-h-[170px] overflow-y-auto scrollbar-none">
                  {categories.map((item) => (
                    <button
                      key={item.value || "all"}
                      type="button"
                      onClick={() => {
                        setParam("category", item.value);
                        setCatOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs ${
                        category === item.value ? "bg-white/5 text-white font-medium" : "text-zinc-400 hover:bg-white/[0.02]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {category === item.value && <span className="h-1 w-1 rounded-full bg-[#DB4444]" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PRICE FILTER DROP-SELECT COMPONENT ACCORDION */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Price Filter
          </p>
          <button
            type="button"
            onClick={() => setPriceOpen(!priceOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3 py-2.5 text-xs text-zinc-200 hover:border-white/10"
          >
            <span className={price ? "text-white font-medium" : "text-zinc-400"}>{activePriceLabel}</span>
            <IconChevronDown className={`size-4 text-zinc-500 transition-transform duration-200 ${priceOpen ? "rotate-180 text-[#DB4444]" : ""}`} />
          </button>

          <AnimatePresence>
            {priceOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-xl border border-white/5 bg-black/40 mt-1"
              >
                <div className="p-1">
                  {priceBands.map((item) => (
                    <button
                      key={item.value || "any"}
                      type="button"
                      onClick={() => {
                        setParam("price", item.value);
                        setPriceOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs ${
                        price === item.value ? "bg-white/5 text-white font-medium" : "text-zinc-400 hover:bg-white/[0.02]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {price === item.value && <span className="h-1 w-1 rounded-full bg-[#DB4444]" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MINIMUM RATING DROP-SELECT COMPONENT ACCORDION */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Minimum Rating
          </p>
          <button
            type="button"
            onClick={() => setRatingOpen(!ratingOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3 py-2.5 text-xs text-zinc-200 hover:border-white/10"
          >
            <span className={rating ? "text-white font-medium" : "text-zinc-400"}>{activeRatingLabel}</span>
            <IconChevronDown className={`size-4 text-zinc-500 transition-transform duration-200 ${ratingOpen ? "rotate-180 text-[#DB4444]" : ""}`} />
          </button>

          <AnimatePresence>
            {ratingOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-xl border border-white/5 bg-black/40 mt-1"
              >
                <div className="p-1">
                  {ratings.map((item) => (
                    <button
                      key={item.value || "any-rating"}
                      type="button"
                      onClick={() => {
                        setParam("rating", item.value);
                        setRatingOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs ${
                        rating === item.value ? "bg-white/5 text-white font-medium" : "text-zinc-400 hover:bg-white/[0.02]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {rating === item.value && <span className="h-1 w-1 rounded-full bg-[#DB4444]" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ENHANCED SORT SELECTION ACCORDION SYSTEM FLOW */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Catalog Sort Order
          </p>
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3 py-2.5 text-xs text-zinc-200 hover:border-white/10"
          >
            <span className="text-white font-medium">{activeSortLabel}</span>
            <IconChevronDown className={`size-4 text-zinc-500 transition-transform duration-200 ${sortOpen ? "rotate-180 text-[#DB4444]" : ""}`} />
          </button>

          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-xl border border-white/5 bg-black/40 mt-1"
              >
                <div className="p-1">
                  {sortOptions.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setParam("sort", item.value);
                        setSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs ${
                        sortBy === item.value ? "bg-white/5 text-white font-medium" : "text-zinc-400 hover:bg-white/[0.02]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {sortBy === item.value && <span className="h-1 w-1 rounded-full bg-[#DB4444]" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sticky Clear Footnote Button (Fades out when filters are reset) */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 border-t border-white/5 overflow-hidden"
            >
              <Button
                type="button"
                onClick={clearFilters}
                className="h-10 w-full rounded-xl bg-[#DB4444] font-medium text-white text-xs hover:bg-[#c53a3a] transition-colors flex items-center justify-center gap-2 mt-2 shadow-md shadow-[#DB4444]/10 active:scale-[0.99]"
              >
                <IconTrash className="size-3.5" />
                Clear Matrix Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}