import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import ProductGrid from "./ProductGrid";
import ProductSection from "./ProductSection";
import type { Product } from "../types/product.types";

type Props = {
  products: Product[];
};

export default function NewArrivalsSection({ products }: Props) {
  const newArrivals = [...products]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 8);

  if (newArrivals.length === 0) return null;

  return (
    <ProductSection
      title="New arrivals"
      description="Recently added products fresh in the catalog."
      action={
        <Button asChild variant="outline" className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5">
          <Link to="/products">Browse all</Link>
        </Button>
      }
    >
      <ProductGrid products={newArrivals} />
    </ProductSection>
  );
}