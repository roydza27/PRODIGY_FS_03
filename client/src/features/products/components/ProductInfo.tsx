import { Heart } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import ProductRating from "./ProductRating";

interface Props {
  name: string;
  category?: string;
  price: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  isWishlisted?: boolean;
  onWishlistToggle?: () => void;
  wishlistLoading?: boolean;
}

export default function ProductInfo({
  name,
  category,
  price,
  description,
  rating = 4,
  reviewCount = 150,
  inStock = true,
  isWishlisted = false,
  onWishlistToggle,
  wishlistLoading = false,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Category + Wishlist row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {category ? (
            <span className="inline-block rounded-md border border-white/8 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              {category}
            </span>
          ) : null}

          <h1 className="mt-2.5 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[2rem]">
            {name}
          </h1>
        </div>

        {onWishlistToggle ? (
          <Button
            type="button"
            variant="outline"
            onClick={onWishlistToggle}
            disabled={wishlistLoading}
            className={[
              "h-12 rounded-xl border-white/10 bg-black/20 text-white hover:bg-white/5",
              isWishlisted ? "border-red-500/40 text-red-400" : "",
            ].join(" ")}
          >
            <Heart
              className={`mr-2 h-4 w-4 ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
            {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          </Button>
        ) : null}
      </div>

      {/* Rating + stock */}
      <div className="flex flex-wrap items-center gap-3">
        <ProductRating rating={rating} reviewCount={reviewCount} />
        <span className="h-3.5 w-px bg-white/15" />
        <span
          className={[
            "text-xs font-semibold",
            inStock ? "text-emerald-400" : "text-red-400",
          ].join(" ")}
        >
          {inStock ? "● In Stock" : "● Out of Stock"}
        </span>
      </div>

      {/* Price */}
      <div>
        <span className="text-3xl font-bold tracking-tight text-white">
          {price}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

      {/* Description */}
      <p className="text-sm leading-relaxed text-zinc-400 sm:text-[0.9375rem]">
        {description ||
          "High quality product with a clean, modern finish and reliable everyday performance."}
      </p>
    </div>
  );
}