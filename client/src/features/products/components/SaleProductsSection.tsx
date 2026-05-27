// features/products/components/SaleProductsSection.tsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import ProductGrid from "./ProductGrid";
import ProductSection from "./ProductSection";
import type { Product } from "../types/product.types";

type AnyProduct = Product & {
  stock?: number;
  createdAt?: string | Date;
};

type Props = {
  products: Product[];
};

export default function SaleProductsSection({ products }: Props) {
  const saleItems = useMemo(() => {
    return [...products]
      // 1. Filter: Keep only items that have a valid discount
      .filter((product) => {
        return (
          typeof product.compareAtPrice === "number" &&
          product.compareAtPrice > product.price
        );
      })
      // 2. Sort Matrix: Higher stock takes priority; Freshness acts as the tie-breaker
      .sort((a: AnyProduct, b: AnyProduct) => {
        const aStock = a.stock ?? 0;
        const bStock = b.stock ?? 0;

        // Condition A: Prioritize items with deeper stock volumes
        if (bStock !== aStock) {
          return bStock - aStock;
        }

        // Condition B (Tie-Breaker): If stock counts are identical, sort by newest arrival date
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      // 3. Keep the top 8 premium entries
      .slice(0, 8);
  }, [products]);

  // Prevent blank components from rendering if there are zero promotional sale entries
  if (saleItems.length === 0) return null;

  return (
    <ProductSection
      title="On sale"
      description="Top trending deals with maximum availability and fresh stock."
      action={
        <Button asChild variant="outline" className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5">
          <Link to="/products?onSale=1">See more deals</Link>
        </Button>
      }
    >
      <ProductGrid products={saleItems} />
    </ProductSection>
  );
}