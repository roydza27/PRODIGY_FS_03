import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { Product } from "@/features/products/types/product.types";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0];
  const productUrl = `/products/${product._id}`;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a] transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_30px_rgb(255,255,255,0.04)]">
      
      {/* --- Image Section --- */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/5 bg-zinc-900">
        <Link to={productUrl} className="block h-full w-full">
          {image ? (
            <img
              src={product.images?.[0] || "/placeholder-product.png"}
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

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2 pointer-events-none">
          {product.isFeatured && (
            <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-red-400 backdrop-blur-md">
              Featured
            </span>
          )}
        </div>

        {/* Quick Actions (Slide-in on hover) */}
        <div className="absolute right-4 top-4 flex translate-x-4 flex-col gap-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
          <button 
            aria-label="Add to Wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-zinc-300 backdrop-blur-md transition-colors hover:bg-white hover:text-black"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button 
            aria-label="Quick View"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-zinc-300 backdrop-blur-md transition-colors hover:bg-white hover:text-black"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="flex flex-1 flex-col p-6">
        
        {/* Meta Row (Category & Rating) */}
        <div className="mb-3 flex items-center justify-between">
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

        {/* Title & Description */}
        <div className="mb-5 flex-1 text-left">
          <Link to={productUrl} className="group/title inline-block">
            <h3 className="text-base font-semibold leading-snug text-zinc-100 transition-colors group-hover/title:text-white sm:text-lg">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
            {product.description}
          </p>
        </div>

        {/* Subtle Divider */}
        <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Footer Row (Pricing & Action) */}
        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            {product.compareAtPrice ? (
              <span className="text-xs font-medium text-zinc-500 line-through">
                ₹{product.compareAtPrice}
              </span>
            ) : (
              // Empty placeholder to maintain height if no compare price
              <span className="h-4" /> 
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white sm:text-2xl">
                ₹{product.price}
              </span>
            </div>
            {/* Added stock subtly underneath the price */}
            <span className="text-[10px] text-zinc-500">
              {product.stock ?? 0} in stock
            </span>
          </div>

          <Button 
            className="h-11 rounded-xl border border-white/5 bg-white/10 px-5 text-sm font-medium text-white transition-all hover:bg-white/20 hover:text-white active:scale-95"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
      
    </div>
  );
}