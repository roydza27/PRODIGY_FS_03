import { Link } from "react-router-dom";
import { formatPrice } from "@/features/products/utils/product.helpers";

type Props = {
  subtotal: number;
  itemCount: number;
  onClearCart: () => void;
};

export default function CartSummary({ subtotal, itemCount, onClearCart }: Props) {
  return (
    <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-lg font-semibold text-white">Order Summary</h2>

      <div className="mt-4 space-y-3 text-sm text-zinc-300">
        <div className="flex items-center justify-between">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span>Calculated later</span>
        </div>
      </div>

      <div className="my-4 h-px bg-white/10" />

      <div className="flex items-center justify-between text-base font-semibold text-white">
        <span>Total</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      <button
        type="button"
        onClick={onClearCart}
        className="mt-5 w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300 transition hover:border-red-500/40 hover:text-red-300"
      >
        Clear Cart
      </button>

      <Link
        to="/checkout"
        className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
      >
        Proceed to Checkout
      </Link>
    </aside>
  );
}