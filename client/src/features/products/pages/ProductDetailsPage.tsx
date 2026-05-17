import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Star,
  Truck,
  Eye,
} from "lucide-react";
import { useProduct } from "../hooks/useProduct";
import { formatPrice, getProductImage } from "../utils/product.helpers";
import { useProducts } from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/features/cart/context/CartContext";

export default function ProductDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { product, loading, error } = useProduct(id || "");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("red");
  const [activeImage, setActiveImage] = useState(0);

  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    { id: "blue", hex: "#A0BCE0" },
    { id: "red", hex: "#E07575" },
    { id: "green", hex: "#A9D18E" },
  ];

  const images = useMemo(() => {
    const base = product ? product.images?.filter(Boolean) || [] : [];
    const fallback = product ? [getProductImage(product)] : [];
    const combined = base.length ? base : fallback;
    return [...combined, ...combined, ...combined].slice(0, 4);
  }, [product]);

  const { products } = useProducts();

  const relatedItems = useMemo(() => {
    if (!product) return [];

    const sameCategory = products
      .filter(
        (p) =>
          p._id !== product._id &&
          p.category &&
          product.category &&
          p.category.toLowerCase() === product.category.toLowerCase()
      )
      .slice(0, 4);

    if (sameCategory.length) return sameCategory;

    return products.filter((p) => p._id !== product._id).slice(0, 4);
  }, [products, product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111113]/95 px-4 py-10 text-white md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-10 text-zinc-300">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#111113]/95 px-4 py-10 text-white md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 p-10 text-red-300">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111113]/95 text-white">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <span>Home</span>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span className="text-zinc-200">{product.name}</span>
        </div>

        <section className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="grid gap-4 sm:grid-cols-[92px_minmax(0,1fr)]">
            <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
              {images.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={[
                    "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border bg-black/30 p-2 transition",
                    activeImage === idx
                      ? "border-red-500"
                      : "border-white/10 hover:border-white/20",
                  ].join(" ")}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>

            <div className="order-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 sm:order-2 sm:p-8">
              <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-black/30 p-4">
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {product.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-[#FFAD33] text-[#FFAD33]"
                      />
                    ))}
                    <Star className="h-4 w-4 fill-zinc-700 text-transparent" />
                    <span className="ml-1">(150 Reviews)</span>
                  </div>
                  <span className="hidden h-4 w-px bg-white/20 sm:block" />
                  <span className="font-medium text-emerald-400">
                    In Stock
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/20 transition hover:border-white/20 hover:bg-black/40"
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 text-3xl font-semibold">
              {formatPrice(product.price)}
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
              {product.description ||
                "High quality product with a clean, modern finish and reliable everyday performance."}
            </p>

            <div className="my-6 h-px w-full bg-white/10" />

            <div className="grid gap-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <span className="text-sm font-medium text-zinc-300 sm:text-base">
                  Colours:
                </span>
                <div className="flex items-center gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color.id)}
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 transition",
                        selectedColor === color.id
                          ? "border-white"
                          : "border-transparent",
                      ].join(" ")}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <span className="text-sm font-medium text-zinc-300 sm:text-base">
                  Size:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={[
                        "h-10 min-w-10 rounded-xl border px-3 text-sm font-medium transition",
                        selectedSize === size
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-white/10 bg-black/20 text-zinc-300 hover:border-white/20",
                      ].join(" ")}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                {/* Quantity Selector */}
                <div className="flex h-12 w-full shrink-0 overflow-hidden rounded-xl border border-white/10 sm:w-[160px]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="grid w-12 place-items-center bg-black/20 transition hover:bg-black/40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="grid flex-1 place-items-center border-x border-white/10 text-base font-medium">
                    {quantity}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="grid w-12 place-items-center bg-red-500 text-white transition hover:bg-red-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Primary Action */}
                <button
                  type="button"
                  className="flex h-12 flex-1 items-center justify-center rounded-xl bg-red-500 px-6 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Buy Now
                </button>
                
                {/* Secondary Action */}
<button
  type="button"
  onClick={async () => {
    try {
      await addToCart(product, quantity);
      alert("Added to cart");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add to cart");
    }
  }}
  className="flex h-12 flex-1 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
>
  Add to Cart
</button>
              </div>

              <div className="flex w-full flex-col rounded-md border border-white/10 bg-black/20">
                
                {/* Free Delivery Row */}
                <div className="flex items-center gap-4 p-5">
                  <Truck className="h-8 w-8 shrink-0 text-zinc-200" strokeWidth={1.5} />
                  <div className="flex flex-col gap-1.5">
                    <p className="text-base font-medium text-white text-left leading-none">
                      Free Delivery
                    </p>
                    <a 
                      href="#postal-code" 
                      className="text-xs font-medium text-zinc-400 underline underline-offset-2 hover:text-zinc-300"
                    >
                      Enter your postal code for delivery availability
                    </a>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-white/10" />

                {/* Return Delivery Row */}
                <div className="flex items-center gap-4 p-5">
                  <RotateCcw className="h-8 w-8 shrink-0 text-zinc-200" strokeWidth={1.5} />
                  <div className="flex flex-col gap-1.5">
                    <p className="text-base font-medium text-left text-white leading-none">
                      Return Delivery
                    </p>
                    <p className="text-xs font-medium text-zinc-400">
                      Free 30 days delivery returns. Details
                    </p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 sm:mt-20 lg:mt-24">
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <div className="h-10 w-2 rounded bg-red-500" />
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Related Items
            </h2>
          </div>

          {relatedItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {relatedItems.map((item) => {
                const image = item.images?.[0] || "/placeholder-product.png";

                return (
                  <article
                    key={item._id}
                    onClick={() => navigate(`/products/${item._id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        navigate(`/products/${item._id}`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:border-white/20"
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-black/30">
                      <div className="absolute right-3 top-3 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="grid h-8 w-8 place-items-center rounded-full bg-white text-black/90 transition hover:bg-zinc-100"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="grid h-8 w-8 place-items-center rounded-full bg-white text-black/90 transition hover:bg-zinc-100"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>

                      <img
                        src={image}
                        alt={item.name}
                        className="h-full w-full object-contain p-5"
                      />
                    </div>

                    <div className="mt-4 space-y-2">
                      <h3 className="line-clamp-1 text-sm font-medium sm:text-base">
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-red-400">
                          {formatPrice(item.price)}
                        </span>
                        {item.compareAtPrice ? (
                          <span className="text-sm text-zinc-500 line-through">
                            {formatPrice(item.compareAtPrice)}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={[
                                "h-4 w-4",
                                i < Math.floor(item.rating || 0)
                                  ? "fill-[#FFAD33] text-[#FFAD33]"
                                  : "fill-zinc-700 text-transparent",
                              ].join(" ")}
                            />
                          ))}
                        </div>
                        <span>({item.rating || 0})</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-zinc-400">
              No related products found.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}