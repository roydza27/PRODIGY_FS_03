import { ShieldCheck, Truck, RotateCcw, BadgeCheck } from "lucide-react";

type HighlightItem = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const highlights: HighlightItem[] = [
  {
    icon: ShieldCheck,
    title: "Secure purchase",
    description: "Protected checkout and safe payment processing.",
  },
  {
    icon: Truck,
    title: "Fast delivery",
    description: "Quick shipping with order tracking available.",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    description: "Simple return process within the return window.",
  },
  {
    icon: BadgeCheck,
    title: "Quality assured",
    description: "Checked for quality before dispatch.",
  },
];

export default function ProductHighlights() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:p-7">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Why people buy this</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Quick trust points that help buyers decide faster.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-white/8 bg-black/20 p-4"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}