import { formatPrice } from "@/features/products/utils/product.helpers";
import { useCart } from "@/features/cart/context/CartContext";

export default function CheckoutSummary() {
  const { items, subtotal, itemCount } = useCart();

  return (
    <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-lg font-semibold text-white">Order Summary</h2>

      <div className="mt-4 space-y-4">
        {items.map(({ product, quantity }) => (
          <div key={product._id} className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-black/30">
              <img
                src={product.images?.[0] || "/placeholder-product.png"}
                alt={product.name}
                className="h-full w-full object-contain p-2"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{product.name}</p>
              <p className="text-xs text-zinc-400">Qty: {quantity}</p>
            </div>

            <p className="text-sm font-medium text-zinc-200">
              {formatPrice(product.price * quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="my-4 h-px bg-white/10" />

      <div className="space-y-3 text-sm text-zinc-300">
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
    </aside>
  );
}