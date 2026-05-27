// features/products/components/NewArrivalsSection.tsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import ProductGrid from "./ProductGrid";
import ProductSection from "./ProductSection";
import type { Product } from "../types/product.types";

type AnyProduct = Product & {
  createdAt?: string | Date;
  stock?: number;
};

type Props = {
  products: Product[];
};

export default function NewArrivalsSection({ products }: Props) {
  const newArrivals = useMemo(() => {
    return [...products]
      .sort((a: AnyProduct, b: AnyProduct) => {
        // 1. Primary Sort Rule: Newest Timestamp first
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        
        if (bTime !== aTime) {
          return bTime - aTime;
        }

        // 2. Secondary Sort Rule (Tie-Breaker): Highest stock availability up front
        const aStock = a.stock ?? 0;
        const bStock = b.stock ?? 0;
        return bStock - aStock;
      })
      .slice(0, 8);
  }, [products]);

  // Prevent rendering if catalog is currently empty
  if (newArrivals.length === 0) return null;

  return (
    <ProductSection
      title="New arrivals"
      description="Recently added products fresh in the catalog."
      action={
        <Button asChild variant="outline" className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5">
          {/* Linked with the explicit newest sort parameter matching your ProductsPage sort pipeline */}
          <Link to="/products?sort=newest">Browse all</Link>
        </Button>
      }
    >
      <ProductGrid products={newArrivals} />
    </ProductSection>
  );
}