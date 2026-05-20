import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";

interface Props {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onBuyNow: () => void;
  onAddToCart: () => void;
  loading?: boolean;
}

export default function ProductActions({
  quantity,
  onIncrement,
  onDecrement,
  onBuyNow,
  onAddToCart,
  loading = false,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Quantity stepper */}
      <div className="flex h-11 w-full overflow-hidden rounded-xl border border-white/10 bg-white/4 sm:w-36 shrink-0">
        <button
          type="button"
          onClick={onDecrement}
          className="grid w-11 place-items-center text-zinc-400 transition hover:bg-white/6 hover:text-white active:bg-white/10"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <div className="grid flex-1 place-items-center border-x border-white/8 text-sm font-semibold text-white tabular-nums">
          {quantity}
        </div>
        <button
          type="button"
          onClick={onIncrement}
          className="grid w-11 place-items-center bg-red-500 text-white transition hover:bg-red-600 active:bg-red-700"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Buy Now */}
      <button
        type="button"
        onClick={onBuyNow}
        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(239,68,68,0.25)] transition hover:bg-red-600 hover:shadow-[0_4px_28px_rgba(239,68,68,0.35)] active:scale-[0.98]"
      >
        <Zap className="h-4 w-4" />
        Buy Now
      </button>

      {/* Add to Cart */}
      <button
        type="button"
        onClick={onAddToCart}
        disabled={loading}
        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart className="h-4 w-4" />
        {loading ? "Adding…" : "Add to Cart"}
      </button>
    </div>
  );
}