import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Cart</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
            </p>
          </div>

          {items.length > 0 ? (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex w-fit items-center rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-red-500/40 hover:text-red-300"
            >
              Clear Cart
            </button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-zinc-400">Your cart is empty.</p>
            <Link
              to="/products"
              className="mt-5 inline-flex rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onIncrease={() =>
                    updateQuantity(item.product._id, item.quantity + 1)
                  }
                  onDecrease={() =>
                    updateQuantity(item.product._id, item.quantity - 1)
                  }
                  onRemove={() => removeFromCart(item.product._id)}
                />
              ))}
            </div>

            <CartSummary
              subtotal={subtotal}
              itemCount={itemCount}
              onClearCart={clearCart}
            />
          </div>
        )}
      </div>
    </div>
  );
}