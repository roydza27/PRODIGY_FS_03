import {
  Laptop,
  Shirt,
  Sofa,
  HeartPulse,
  ShoppingBasket,
  Gamepad2,
} from "lucide-react";

const categories = [
  {
    title: "Electronics",
    description: "Smart gadgets & accessories",
    icon: Laptop,
  },
  {
    title: "Fashion",
    description: "Trending outfits & wearables",
    icon: Shirt,
  },
  {
    title: "Home Living",
    description: "Modern everyday essentials",
    icon: Sofa,
  },
  {
    title: "Health",
    description: "Daily wellness products",
    icon: HeartPulse,
  },
  {
    title: "Groceries",
    description: "Fresh local store products",
    icon: ShoppingBasket,
  },
  {
    title: "Gaming",
    description: "Consoles & accessories",
    icon: Gamepad2,
  },
];

const CategorySection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-400">
              Store Categories
            </div>

            <div className="space-y-2">
              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Browse products by category.
              </h2>

              <p className="max-w-2xl text-base leading-7 text-zinc-400">
                Explore curated collections designed with a clean shopping
                experience and premium dark UI system.
              </p>
            </div>
          </div>

          <button className="w-fit rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-zinc-200 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]">
            View all categories
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.title}
                className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,68,68,0.12),transparent_40%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30">
                    <Icon className="h-6 w-6 text-zinc-100" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">
                      {category.title}
                    </h3>

                    <p className="text-sm leading-6 text-zinc-400">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;