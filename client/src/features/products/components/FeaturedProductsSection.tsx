import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import ProductGrid from "./ProductGrid";
import ProductSection from "./ProductSection";
import type { Product } from "../types/product.types";

type Props = {
  products: Product[];
};

export default function FeaturedProductsSection({ products }: Props) {
  const featured = products.filter((product) => product.isFeatured).slice(0, 8);

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