import { useMemo } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import ProductGrid from "../components/ProductGrid";
import ProductHero from "../components/ProductHero";
import FeaturedProductsSection from "../components/FeaturedProductsSection";
import TrendingProductsSection from "../components/TrendingProductsSection";
import SaleProductsSection from "../components/SaleProductsSection";
import NewArrivalsSection from "../components/NewArrivalsSection";
import ProductSection from "../components/ProductSection";
import { useProducts } from "../hooks/useProducts";
import { getEffectivePrice } from "../utils/product.helpers";
import { EmptyState, GridSkeleton, ErrorState } from "@/shared/components/page-state";
import ShopFiltersPanel from "../components/ShopFiltersPanel";
import MobileFiltersBar from "../components/MobileFiltersBar";
import { Button } from "@/shared/components/ui/button";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || "newest";
  const price = searchParams.get("price") || "";
  const rating = searchParams.get("rating") || "";
  const inStock = searchParams.get("inStock") === "1";
  const onSale = searchParams.get("onSale") === "1";
  const freeShipping = searchParams.get("freeShipping") === "1";

  // FIXED: Added 'sortBy !== "newest"' to the filter check.
  // If the user requests a custom sort order, it hides the promotional blocks
  // and applies the sort rules natively across the entire catalog grid.
  const hasActiveFilters =
    search.length > 0 ||
    category.length > 0 ||
    sortBy !== "newest" ||
    price.length > 0 ||
    rating.length > 0 ||
    inStock ||
    onSale ||
    freeShipping;

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    const cat = category.toLowerCase().trim();

    let result = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        !cat || (product.category || "").toLowerCase().includes(cat);

      const matchesInStock = !inStock || (product.stock ?? 0) > 0;

      const matchesOnSale =
        !onSale ||
        (typeof product.compareAtPrice === "number" &&
          product.compareAtPrice > product.price);

      const matchesFreeShipping =
        !freeShipping || Boolean((product as { freeShipping?: boolean }).freeShipping);

      const matchesPrice =
        !price ||
        (price === "budget" && getEffectivePrice(product) < 2000) ||
        (price === "mid" &&
          getEffectivePrice(product) >= 2000 &&
          getEffectivePrice(product) <= 5000) ||
        (price === "premium" && getEffectivePrice(product) > 5000);

      const matchesRating =
        !rating ||
        (rating === "4" && (product.rating || 0) >= 4) ||
        (rating === "4.5" && (product.rating || 0) >= 4.5);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesInStock &&
        matchesOnSale &&
        matchesFreeShipping &&
        matchesPrice &&
        matchesRating
      );
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "price-asc") return getEffectivePrice(a) - getEffectivePrice(b);
      if (sortBy === "price-desc") return getEffectivePrice(b) - getEffectivePrice(a);
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [products, search, category, sortBy, price, rating, inStock, onSale, freeShipping]);

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid text-left grid-cols-1 items-start gap-x-8 gap-y-10 lg:grid-cols-[280px_1fr] xl:gap-x-12 xl:grid-cols-[320px_1fr]">
        
        {/* Desktop Sticky Sidebar */}
        <aside className="sticky top-28 hidden lg:block">
          <ShopFiltersPanel />
        </aside>

        {/* Main Content Area */}
        <div className="flex min-w-0 w-full flex-col gap-10 sm:gap-14">
          
          {/* Mobile Filters */}
          <div className="lg:hidden">
            <MobileFiltersBar />
          </div>

          <ProductHero
            stats={{
              products: products.length,
              featured: products.filter((p) => p.isFeatured).length,
              saleItems: products.filter(
                (p) => typeof p.compareAtPrice === "number" && p.compareAtPrice > p.price
              ).length,
            }}
          />

          {loading ? (
            <div className="pt-8">
              <GridSkeleton rows={8} />
            </div>
          ) : error ? (
            <div className="pt-8">
              <ErrorState
                error={error}
                onAction={() => window.location.reload()}
                actionLabel="Retry"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-12 sm:gap-16 overflow-visible">
              
              {/* Promotional Showcase Layout: Now correctly disappears when custom sorting is active */}
              <AnimatePresence mode="wait">
                {!hasActiveFilters ? (
                  <motion.div 
                    key="showcase-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col gap-12 sm:gap-16"
                  >
                    <div id="featured" className="scroll-mt-32">
                      <FeaturedProductsSection products={products} />
                    </div>

                    <div className="scroll-mt-32">
                      <TrendingProductsSection products={products} />
                    </div>

                    <div className="scroll-mt-32">
                      <SaleProductsSection products={products} />
                    </div>

                    <div className="scroll-mt-32">
                      <NewArrivalsSection products={products} />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Dynamic Grid Section */}
              <ProductSection
                title={hasActiveFilters ? "Filtered Results" : "Catalog Preview"}
                description={
                  hasActiveFilters
                    ? "Showing products sorted and filtered by your criteria."
                    : "A quick glimpse of our general collection items."
                }
                className="scroll-mt-32 border-t border-white/5 pt-8 sm:pt-12"
                action={
                  !hasActiveFilters && filteredProducts.length > 3 ? (
                    <Button 
                      onClick={() => setSearchParams({ sort: "newest" })}
                      variant="outline" 
                      className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5 text-xs"
                    >
                      View Full Catalog ({filteredProducts.length})
                    </Button>
                  ) : null
                }
              >
                <div id="catalog" className="pt-4">
                  {filteredProducts.length === 0 ? (
                    <div className="py-16 rounded-3xl border border-dashed border-white/5 bg-[#17171b]/20">
                      <EmptyState
                        title="No products found"
                        description="Try modifying your toggle options or clear filters to look again."
                        actionLabel="Clear Active Filters"
                        onAction={clearFilters}
                        icon={<Search className="h-6 w-6 text-zinc-500" />}
                      />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Displays the entire sorted catalog when filters/sorting are applied, or slices to 3 when on default home dashboard */}
                      <ProductGrid 
                        products={hasActiveFilters ? filteredProducts : filteredProducts.slice(0, 3)} 
                      />

                      {!hasActiveFilters && filteredProducts.length > 3 && (
                        <div className="flex justify-center pt-4">
                          <Button
                            onClick={() => setSearchParams({ sort: "newest" })}
                            className="w-full sm:w-auto rounded-2xl bg-[#DB4444] px-6 py-5 text-white hover:bg-[#c53a3a] text-sm font-medium shadow-lg shadow-[#DB4444]/10 transition-all active:scale-98"
                          >
                            Explore Full Catalog Collection
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ProductSection>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}