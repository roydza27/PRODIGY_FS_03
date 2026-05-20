import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

type Props = {
  title?: string;
  subtitle?: string;
  stats?: {
    products: number;
    featured: number;
    saleItems: number;
  };
};

export default function ProductHero({
  title = "Discover products built for everyday life.",
  subtitle = "Browse featured picks, trending items, and best-value deals in one premium storefront.",
  stats,
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.18),_transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-5">
          <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200">
            Premium storefront
          </span>

          <div className="space-y-3">
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-xl bg-red-500 px-5 text-white hover:bg-red-600">
              <Link to="#featured">Shop featured</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
            >
              <Link to="#catalog">Browse catalog</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-zinc-400">Products</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats?.products ?? "—"}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-zinc-400">Featured</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats?.featured ?? "—"}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-zinc-400">Sale items</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats?.saleItems ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}