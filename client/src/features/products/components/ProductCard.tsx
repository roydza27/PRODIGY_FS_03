"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react";
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
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    if (!isAuthenticated) return toast.info("Please log in");
    toggleWishlist(product);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all hover:border-white/20">
      {/* Image Area - Perfect Square */}
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <Link to={productUrl} className="block h-full w-full">
          <img
            src={image || "/placeholder-product.png"}
            alt={product.name}
            className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Hover Action Overlay */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={handleWishlist}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black backdrop-blur-sm transition hover:bg-white"
          >
            <Heart className={`h-4 w-4 ${isWishlisted(product._id) ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-zinc-300">{product.rating ?? "0.0"}</span>
          </div>
        </div>

        <Link to={productUrl} className="mb-2 block">
          <h3 className="line-clamp-2 text-sm font-medium text-zinc-100 group-hover:text-white sm:text-base">
            {product.name}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-2 text-xs text-zinc-500">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">₹{Number(product.price).toLocaleString("en-IN")}</span>
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="h-9 rounded-xl bg-white px-4 text-xs font-semibold text-black hover:bg-zinc-200"
          >
            {addingToCart ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShoppingCart className="h-3 w-3 mr-2" />}
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}