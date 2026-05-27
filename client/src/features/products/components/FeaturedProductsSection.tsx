import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import ProductGrid from "./ProductGrid";
import ProductSection from "./ProductSection";
import type { Product } from "../types/product.types";

type AnyProduct = Product & {
  isFeatured?: boolean;
  featured?: boolean;
};

type Props = {
  products: Product[];
};

export default function FeaturedProductsSection({ products }: Props) {
  // Enhanced to safely capture both common boolean schema properties ('isFeatured' and 'featured')
  const featured = products
    .filter((product: AnyProduct) => Boolean(product.isFeatured || product.featured))
    .slice(0, 8);

  // Safely falls back to returning null if no matches exist, preventing blank sections
  if (featured.length === 0) return null;

  return (
    <ProductSection
      title="Featured picks"
      description="Hand-picked products worth seeing first."
      action={
        <Button asChild variant="outline" className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5">
          <Link to="/products">View all</Link>
        </Button>
      }
    >
      <ProductGrid products={featured} />
    </ProductSection>
  );
}