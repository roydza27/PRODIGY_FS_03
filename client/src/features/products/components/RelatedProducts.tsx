import { Eye, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  rating?: number;
  images?: string[];
  discount?: number;
}

interface Props {
  products: RelatedProduct[];
  formatPrice: (price: number) => string;
}

export default function RelatedProducts({ products, formatPrice }: Props) {
  const navigate = useNavigate();

  if (!products.length) return null;

  return (
    <section className="mt-20 lg:mt-28">
      {/* Section header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
          Related Items
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((item) => {
          const image = item.images?.[0] ?? "/placeholder-product.png";
          const fullStars = Math.floor(item.rating ?? 0);

          return (
            <article
              key={item._id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/products/${item._id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate(`/products/${item._id}`);
              }}
              className="group relative cursor-pointer rounded-2xl border border-white/8 bg-white/3 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-white/15 hover:bg-white/5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              {/* Image area */}
              <div className="relative mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-black/20">
                {/* Discount badge */}
                {item.discount && (
                  <span className="absolute left-3 top-3 z-10 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    -{item.discount}%
                  </span>
                )}

                {/* Action icons */}
                <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Wishlist"
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-zinc-800 shadow-lg backdrop-blur-sm transition hover:bg-white"
                  >
                    <Heart className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Quick view"
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-zinc-800 shadow-lg backdrop-blur-sm transition hover:bg-white"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>

                <img
                  src={image}
                  alt={item.name}
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
                />

                {/* Add to cart overlay */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full rounded-b-xl bg-zinc-900/90 py-2.5 text-center text-xs font-semibold text-white backdrop-blur-sm transition-transform duration-200 group-hover:translate-y-0">
                  Add to Cart
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1.5">
                <h3 className="line-clamp-1 text-sm font-medium text-zinc-200">
                  {item.name}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-red-400">
                    {formatPrice(item.price)}
                  </span>
                  {item.compareAtPrice && (
                    <span className="text-xs text-zinc-600 line-through">
                      {formatPrice(item.compareAtPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={[
                          "h-3 w-3",
                          i < fullStars
                            ? "fill-amber-400 text-amber-400"
                            : "fill-zinc-700 text-zinc-700",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-600">
                    ({item.rating ?? 0})
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}