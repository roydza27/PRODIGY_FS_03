import { ArrowRight, BadgePercent } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const PromoBannerSection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-left">
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

            <div className="relative w-full">
              {/* 1. Replaced strict max-w-[420px] with fluid widths (max-w-md md:max-w-2xl).
                2. Removed forced aspect ratio on mobile (h-auto), applied it only on sm+ screens.
                3. Adjusted padding for mobile (p-4) and desktop (sm:p-6).
              */}
              <div className="mx-auto w-full h-auto max-w-md sm:aspect-[4/3] md:max-w-2xl rounded-[28px] border border-white/10 bg-black/30 p-4 sm:p-6 backdrop-blur">
                <div className="flex h-full flex-col justify-between gap-6 rounded-[24px] border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4 sm:p-6">
                  
                  {/* Header */}
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500 sm:text-sm">
                        Deal spotlight
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-white sm:mt-2 sm:text-2xl">
                        Up to 40% off
                      </h3>
                    </div>
                    {/* Added shrink-0 and w-fit to ensure the badge never stretches or covers the layout on tight screens */}
                    <div className="inline-flex w-fit shrink-0 items-center rounded-full border border-white/10 bg-[#DB4444]/15 px-3 py-1 text-xs font-medium text-[#ff9a9a]">
                      Today only
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="mb-4 mt-auto grid grid-cols-1 gap-3 sm:my-auto sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 sm:text-xs">
                        Fast delivery
                      </p>
                      <p className="mt-1 text-sm font-medium text-white sm:mt-2">
                        Local shipping support
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 sm:text-xs">
                        Secure checkout
                      </p>
                      <p className="mt-1 text-sm font-medium text-white sm:mt-2">
                        Smooth payment flow
                      </p>
                    </div>
                  </div>

                  {/* Footer Offer */}
                  <div className="rounded-3xl border border-white/10 bg-[#0f0f12] p-4 sm:p-5">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 sm:text-xs">
                          Bundle offer
                        </p>
                        <p className="mt-1 text-base font-semibold text-white sm:mt-2 sm:text-lg">
                          Buy 2, save more
                        </p>
                      </div>
                      <p className="text-xl font-semibold text-[#DB4444] sm:text-2xl">-20%</p>
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
