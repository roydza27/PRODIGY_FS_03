import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import ProductGrid from "./ProductGrid";
import ProductSection from "./ProductSection";
import type { Product } from "../types/product.types";

type Props = {
  products: Product[];
};

export default function TrendingProductsSection({ products }: Props) {
  const trending = [...products]
    .sort((a, b) => {
      const aScore = (a.rating || 0) + (a.isFeatured ? 1 : 0);
      const bScore = (b.rating || 0) + (b.isFeatured ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, 8);

  if (trending.length === 0) return null;

  return (
    <ProductSection
      title="Trending now"
      description="Popular items customers are checking out most."
      action={
        <Button asChild variant="outline" className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5">
          <Link to="/products">Explore catalog</Link>
        </Button>
      }
    >
      <ProductGrid products={trending} />
    </ProductSection>
  );
}