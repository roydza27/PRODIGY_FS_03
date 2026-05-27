import { useMemo } from "react"; // Add this line
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import ProductGrid from "./ProductGrid";
import ProductSection from "./ProductSection";
import type { Product } from "../types/product.types";

// Extend the type locally to safely capture common metrics if they exist in your DB schema
type AnyProduct = Product & {
  reviewCount?: number;
  reviewsCount?: number;
  reviews?: unknown[];
  views?: number;
  isFeatured?: boolean;
  featured?: boolean;
};

type Props = {
  products: Product[];
};

export default function TrendingProductsSection({ products }: Props) {
  const trending = useMemo(() => {
    return [...products]
      .sort((a: AnyProduct, b: AnyProduct) => {
        // 1. Extract total number of reviews safely from whatever structure your schema uses
        const aReviews = a.reviewCount ?? a.reviewsCount ?? (Array.isArray(a.reviews) ? a.reviews.length : 0);
        const bReviews = b.reviewCount ?? b.reviewsCount ?? (Array.isArray(b.reviews) ? b.reviews.length : 0);

        // 2. Primary sorting rule: Higher review count takes priority
        if (bReviews !== aReviews) {
          return bReviews - aReviews;
        }

        // 3. Secondary sorting rule (Tie-Breaker): If review count matches, fall back to weighted star rating
        const aScore = (a.rating || 0) + (a.isFeatured || a.featured ? 1 : 0);
        const bScore = (b.rating || 0) + (b.isFeatured || b.featured ? 1 : 0);
        return bScore - aScore;
      })
      .slice(0, 8);
  }, [products]);

  if (trending.length === 0) return null;

  return (
    <ProductSection
      title="Trending now"
      description="Popular items with the highest number of customer reviews."
      action = {
        <Button asChild variant="outline" className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5">
          <Link to="/products">Explore catalog</Link>
        </Button>
      }
    >
      <ProductGrid products={trending} />
    </ProductSection>
  );
}