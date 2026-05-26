import { useMemo } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

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
            <div className="flex flex-col gap-16 sm:gap-24">
              
              {/* Only show these sections if no filters are applied */}
              {!hasActiveFilters ? (
                <div className="flex flex-col gap-16 sm:gap-24">
                  <div id="featured" className="scroll-mt-28">
                    <FeaturedProductsSection products={products} />
                  </div>

                  <div className="scroll-mt-28">
                    <TrendingProductsSection products={products} />
                  </div>

                  <div className="scroll-mt-28">
                    <SaleProductsSection products={products} />
                  </div>

                  <div className="scroll-mt-28">
                    <NewArrivalsSection products={products} />
                  </div>
                </div>
              ) : null}

              {/* Main Catalog / Filter Results */}
              <ProductSection
                title={hasActiveFilters ? "Filtered results" : "Full catalog"}
                description={
                  hasActiveFilters
                    ? "Showing products that match your current filters."
                    : "Browse the complete collection."
                }
                className="scroll-mt-28"
              >
                <div id="catalog" className="pt-4">
                  {filteredProducts.length === 0 ? (
                    <div className="py-12">
                      <EmptyState
                        title="No products found"
                        description="Try changing your filters or searching for something else."
                        actionLabel="Clear filters"
                        onAction={clearFilters}
                        icon={<Search className="h-6 w-6 text-zinc-500" />}
                      />
                    </div>
                  ) : (
                    <ProductGrid products={filteredProducts} />
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