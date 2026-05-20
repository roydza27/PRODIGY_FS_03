import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import ProductGrid from "./ProductGrid";
import ProductSection from "./ProductSection";
import type { Product } from "../types/product.types";

type Props = {
  products: Product[];
};

export default function SaleProductsSection({ products }: Props) {
  const saleItems = products
    .filter((product) => {
      return (
        typeof product.compareAtPrice === "number" &&
        product.compareAtPrice > product.price
      );
    })
    .slice(0, 8);

  if (saleItems.length === 0) return null;

  return (
    <ProductSection
      title="On sale"
      description="Better value picks with current discounts."
      action={
        <Button asChild variant="outline" className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5">
          <Link to="/products">See more deals</Link>
        </Button>
      }
    >
      <ProductGrid products={saleItems} />
    </ProductSection>
  );
}