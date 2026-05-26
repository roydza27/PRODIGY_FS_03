import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingCart, Star, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import type { Product } from "@/features/products/types/product.types";
import { useCart } from "@/features/cart/context/CartContext";
import { useAuthStore } from "@/app/store/auth.store";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0];
  const productUrl = `/products/${product._id}`;

  const { addToCart } = useCart();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [addingToCart, setAddingToCart] = useState(false);
  const [copyingId, setCopyingId] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to add items to your cart");
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product, 1);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to save items to your wishlist");
      return;
    }

    const alreadyWishlisted = isWishlisted(product._id);
    toggleWishlist(product);
    toast.success(alreadyWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleCopyId = async () => {
    try {
      setCopyingId(true);
      await navigator.clipboard.writeText(product._id);
      toast.success("Product ID copied");
    } catch {
      toast.error("Failed to copy product ID");
    } finally {
      setCopyingId(false);
    }
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a] transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_30px_rgb(255,255,255,0.04)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/5 bg-zinc-900">
        <Link to={productUrl} className="block h-full w-full">
          {image ? (
            <img
              src={image || "/placeholder-product.png"}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = "/placeholder-product.png";
              }}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-900/50 text-sm text-zinc-600">
              No image available
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-red-400 backdrop-blur-md">
              Featured
            </span>
          )}
        </div>

        <div className="absolute right-4 top-4 flex translate-x-4 flex-col gap-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
          <button
            type="button"
            aria-label="Add to Wishlist"
            onClick={handleWishlist}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-zinc-300 backdrop-blur-md transition-colors hover:bg-white hover:text-black"
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted(product._id) ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>

          <Link
            to={productUrl}
            aria-label="Quick View"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-zinc-300 backdrop-blur-md transition-colors hover:bg-white hover:text-black"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500">
            {product.category}
          </span>
          <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-2 py-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-zinc-300">
              {product.rating ?? "4.8"}
            </span>
          </div>
        </div>

        <div className="mb-5 flex-1 text-left">
          <Link to={productUrl} className="group/title inline-block">
            <h3 className="text-base font-semibold leading-snug text-zinc-100 transition-colors group-hover/title:text-white sm:text-lg">
              {product.name}
            </h3>
          </Link>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
            {product.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
              ID: <span className="font-mono">{product._id}</span>
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-medium text-zinc-300 transition hover:bg-white/5"
            >
              <Copy className="h-3 w-3" />
              {copyingId ? "Copying..." : "Copy ID"}
            </button>
          </div>
        </div>

        <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            {product.compareAtPrice ? (
              <span className="text-xs font-medium text-zinc-500 line-through">
                ₹{product.compareAtPrice}
              </span>
            ) : (
              <span className="h-4" />
            )}
            <span className="text-xl font-bold text-white sm:text-2xl">
              ₹{product.price}
            </span>
            <span className="text-[10px] text-zinc-500">
              {product.stock ?? 0} in stock
            </span>
          </div>

          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="h-11 rounded-xl border border-white/5 bg-white/10 px-5 text-sm font-medium text-white transition-all hover:bg-white/20 active:scale-95"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {addingToCart ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
}