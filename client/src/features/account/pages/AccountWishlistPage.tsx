import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import type { Product } from "@/features/products/types/product.types";
import ProductGrid from "@/features/products/components/ProductGrid";
import api from "@/services/api";

type WishlistResponse = {
  success: boolean;
  message?: string;
  data: {
    userId: string;
    wishlist: Product[];
  };
};

export default function AccountWishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadWishlist = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await api.get<WishlistResponse>("/wishlist");

        if (!active) return;

        setWishlistProducts(Array.isArray(data.data.wishlist) ? data.data.wishlist : []);
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error ? err.message : "Failed to load wishlist"
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadWishlist();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#111113] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              My Wishlist
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {loading
                ? "Loading..."
                : `${wishlistProducts.length} item${wishlistProducts.length !== 1 ? "s" : ""} saved for later`}
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            disabled
          >
            Move all to cart
          </Button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-zinc-400">
            Loading wishlist...
          </div>
        ) : wishlistProducts.length > 0 ? (
          <ProductGrid products={wishlistProducts} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <ShoppingCart className="h-8 w-8 text-zinc-500" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-white">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-zinc-400">
              Save items you love to find them later.
            </p>
            <Button
              asChild
              className="mt-6 rounded-xl bg-[#DB4444] text-white hover:bg-[#c53a3a]"
            >
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}