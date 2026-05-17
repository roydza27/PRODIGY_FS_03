import { ArrowRight, BadgePercent } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const PromoBannerSection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#151518] px-6 py-10 shadow-2xl shadow-black/20 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,68,68,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-400">
                <BadgePercent className="h-3.5 w-3.5 text-[#DB4444]" />
                Limited time offer
              </div>

              <div className="space-y-3">
                <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                  Build a storefront that feels polished and conversion-ready.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                  Use this banner to highlight seasonal discounts, bundle offers, or featured local products with a premium dark theme.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="h-14 rounded-2xl bg-[#DB4444] px-6 text-white hover:bg-[#c53a3a]">
                  Shop the offer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  className="h-14 rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-white hover:bg-white/[0.07]"
                >
                  Learn more
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="mx-auto aspect-[4/3] max-w-[420px] rounded-[28px] border border-white/10 bg-black/30 p-6 backdrop-blur">
                <div className="flex h-full flex-col justify-between rounded-[24px] border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">
                        Deal spotlight
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        Up to 40% off
                      </h3>
                    </div>
                    <div className="rounded-full border border-white/10 bg-[#DB4444]/15 px-3 py-1 text-xs font-medium text-[#ff9a9a]">
                      Today only
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                        Fast delivery
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        Local shipping support
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                        Secure checkout
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        Smooth payment flow
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-[#0f0f12] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                          Bundle offer
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          Buy 2, save more
                        </p>
                      </div>
                      <p className="text-2xl font-semibold text-[#DB4444]">-20%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBannerSection;
