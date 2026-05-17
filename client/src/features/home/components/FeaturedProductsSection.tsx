import { ArrowRight, Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const products = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    price: "₹2,499",
    oldPrice: "₹3,499",
    rating: 4.8,
    badge: "Best Seller",
  },
  {
    name: "Minimal Smart Watch",
    category: "Wearables",
    price: "₹3,999",
    oldPrice: "₹5,199",
    rating: 4.7,
    badge: "Hot Deal",
  },
  {
    name: "Premium Backpack",
    category: "Accessories",
    price: "₹1,299",
    oldPrice: "₹1,799",
    rating: 4.6,
    badge: "New",
  },
  {
    name: "Kitchen Organizer Set",
    category: "Home & Living",
    price: "₹899",
    oldPrice: "₹1,199",
    rating: 4.5,
    badge: "Trending",
  },
];

const FeaturedProductsSection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-400">
              Featured Products
            </div>
            <div className="space-y-2">
              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Handpicked items for your local store.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-zinc-400">
                Build a polished storefront with clean product cards, clear pricing, and strong add-to-cart actions.
              </p>
            </div>
          </div>

          <Button className="w-fit rounded-2xl bg-[#DB4444] px-5 py-6 text-white hover:bg-[#c53a3a]">
            View all products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.name}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="relative aspect-[4/3] border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]">
                <div className="absolute left-4 top-4 rounded-full bg-[#DB4444] px-3 py-1 text-xs font-medium text-white">
                  {product.badge}
                </div>

                <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-zinc-100 transition hover:bg-white/10">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-zinc-100 transition hover:bg-white/10">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-28 w-28 rounded-full border border-dashed border-white/10 bg-black/20" />
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    {product.category}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Star className="h-4 w-4 fill-[#DB4444] text-[#DB4444]" />
                  <span>{product.rating}</span>
                  <span>•</span>
                  <span>In stock</span>
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-500 line-through">
                      {product.oldPrice}
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {product.price}
                    </p>
                  </div>

                  <Button
                    size="icon"
                    className="h-11 w-11 rounded-2xl bg-white/10 text-white hover:bg-white/15"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
