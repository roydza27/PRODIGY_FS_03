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
  <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
    <aside className="hidden lg:block">
      <ShopFiltersPanel />
    </aside>

    <div className="min-w-0 w-full space-y-6 sm:space-y-8">
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
      <GridSkeleton rows={8} />
    ) : error ? (
      <ErrorState
        error={error}
        onAction={() => window.location.reload()}
        actionLabel="Retry"
      />
    ) : (
      <>
        {!hasActiveFilters ? (
          <>
            <div id="featured">
              <FeaturedProductsSection products={products} />
            </div>

            <TrendingProductsSection products={products} />

            <SaleProductsSection products={products} />

            <NewArrivalsSection products={products} />
          </>
        ) : null}

        <ProductSection
          title={hasActiveFilters ? "Filtered results" : "Full catalog"}
          description={
            hasActiveFilters
              ? "Showing products that match your current filters."
              : "Browse the complete collection."
          }
          className="scroll-mt-24"
        >
          <div id="catalog">
            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try changing your filters."
                actionLabel="Clear filters"
                onAction={clearFilters}
                icon={<Search className="h-5 w-5" />}
              />
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </ProductSection>
      </>
    )}
  </div>
</div>


  );
}