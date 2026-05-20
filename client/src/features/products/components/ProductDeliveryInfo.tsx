import { RotateCcw, Truck } from "lucide-react";

export default function ProductDeliveryInfo() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/3">
      {/* Free Delivery */}
      <div className="flex items-start gap-4 p-5">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <Truck className="h-5 w-5 text-zinc-300" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Free Delivery</p>
          <a
            href="#postal-code"
            className="mt-1 block text-xs text-zinc-500 underline underline-offset-2 transition hover:text-zinc-300"
          >
            Enter your postal code for delivery availability
          </a>
        </div>
      </div>

      <div className="mx-5 h-px bg-white/6" />

      {/* Return Delivery */}
      <div className="flex items-start gap-4 p-5">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <RotateCcw className="h-5 w-5 text-zinc-300" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Return Delivery</p>
          <p className="mt-1 text-xs text-zinc-500">
            Free 30 days delivery returns.{" "}
            <a href="#" className="underline underline-offset-2 hover:text-zinc-300 transition">
              Details
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}