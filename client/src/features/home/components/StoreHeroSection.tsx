import { ArrowRight, Search, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

const StoreHeroSection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent p-6 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(219,68,68,0.16),transparent_32%)]" />
          <div className="relative z-10 flex flex-col gap-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-zinc-300">
              <ShoppingBag className="h-3.5 w-3.5 text-[#DB4444]" />
              Local Store E-commerce Platform
            </div>

            <div className="max-w-2xl space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-zinc-400">
                New season arrivals
              </p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[4.25rem] lg:leading-[0.95]">
                Shop smarter with a clean, premium local store experience.
              </h1>
              <p className="max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
                Discover curated products, fast browsing, simple cart actions, and a smooth shopping flow built for your internship project.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Search products, brands, categories..."
                  className="h-14 rounded-2xl border-white/10 bg-black/30 pl-11 text-base text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                />
              </div>
              <Button className="h-14 rounded-2xl bg-[#DB4444] px-6 text-white hover:bg-[#c53a3a]">
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Fast checkout", value: "1-click cart flow" },
                { label: "Trusted store", value: "Quality local products" },
                { label: "Support ready", value: "Easy order help" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-zinc-100">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#17171b] p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Featured deal</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Daily essentials</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                Up to 30% off
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-gradient-to-br from-[#DB4444]/15 via-white/[0.04] to-transparent p-6">
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Star className="h-4 w-4 text-[#DB4444]" />
                Best seller this week
              </div>
              <div className="mt-5 aspect-[4/3] rounded-[20px] border border-dashed border-white/10 bg-black/20" />
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-500 line-through">₹1,999</p>
                  <p className="text-3xl font-semibold text-white">₹1,399</p>
                </div>
                <Button variant="secondary" className="rounded-2xl bg-white/10 text-white hover:bg-white/15">
                  Add to cart
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { title: "Fresh groceries", note: "Daily use items" },
              { title: "Home essentials", note: "Useful every day" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-sm text-zinc-500">{item.note}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                <div className="mt-5 h-28 rounded-2xl border border-dashed border-white/10 bg-black/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreHeroSection;
