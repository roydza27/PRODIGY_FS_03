import { ArrowRight, Headphones, ShoppingCart, Store } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const CTASection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#DB4444]/18 via-white/[0.04] to-transparent px-6 py-10 shadow-2xl shadow-black/20 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(219,68,68,0.18),transparent_34%)]" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-300">
                <Store className="h-3.5 w-3.5 text-[#DB4444]" />
                Ready to launch
              </div>

              <div className="space-y-3">
                <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                  Start building your local store e-commerce platform today.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                  Turn this homepage into a complete shopping experience with product browsing, cart actions, order tracking, and customer support.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="h-14 rounded-2xl bg-white px-6 text-black hover:bg-zinc-100">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  className="h-14 rounded-2xl border border-white/10 bg-black/20 px-6 text-white hover:bg-black/30"
                >
                  Contact Support
                  <Headphones className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[24px] border border-white/10 bg-black/25 p-5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">
                      Cart ready
                    </p>
                    <p className="mt-1 text-base font-medium text-white">
                      Add, review, and checkout smoothly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">
                  Next step
                </p>
                <p className="mt-2 text-base font-medium text-white">
                  Connect products, cart state, and order flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
