import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

type PromoState = {
  code: string;
  message: string;
  applied: boolean;
};

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getProductTitle(product: any) {
  return product?.name || product?.title || "Product";
}

function getProductImage(product: any) {
  return product?.image || product?.images?.[0] || "";
}

function getProductBrand(product: any) {
  return product?.brand || product?.manufacturer || "";
}

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();

  const [promo, setPromo] = useState<PromoState>({
    code: "",
    message: "",
    applied: false,
  });

  const shippingThreshold = 500;
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 199;
  const discount = promo.applied ? subtotal * 0.1 : 0;
  const taxableAmount = Math.max(subtotal - discount, 0);
  const tax = taxableAmount * 0.10;
  const total = Math.max(taxableAmount + shipping + tax, 0);
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);

  const savingsMessage = useMemo(() => {
    if (subtotal === 0) return "Add items to unlock free shipping.";
    if (subtotal >= shippingThreshold) return "Free shipping unlocked.";
    const remaining = shippingThreshold - subtotal;
    return `Add ${formatINR(remaining)} more to get free shipping.`;
  }, [subtotal]);

  const applyPromo = () => {
    const code = promo.code.trim().toUpperCase();

    if (!code) {
      setPromo({ code: "", message: "Enter a promo code.", applied: false });
      return;
    }

    if (code === "SAVE10" || code === "WELCOME10") {
      setPromo({
        code,
        message: "Promo applied successfully.",
        applied: true,
      });
      return;
    }

    setPromo({
      code,
      message: "Invalid promo code.",
      applied: false,
    });
  };

  const removePromo = () => {
    setPromo({
      code: "",
      message: "",
      applied: false,
    });
  };

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl text-left">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-zinc-300">
              Secure checkout ready
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your Cart
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Review your items, adjust quantities, apply a promo code, and continue to checkout with confidence.
            </p>
          </div>

          {items.length > 0 ? (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex w-fit items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-200"
            >
              Clear Cart
            </button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="grid min-h-[420px] place-items-center rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-10 w-10 text-zinc-300"
                >
                  <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 13l-1.2-8H3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 13l1.2 5.2a1 1 0 0 0 1 .8h7.8a1 1 0 0 0 1-.8L19 13" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="21" r="1.2" fill="currentColor" />
                  <circle cx="17" cy="21" r="1.2" fill="currentColor" />
                </svg>
              </div>

              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Browse products, add your favorites, and build your order in a few clicks.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-2xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Start Shopping
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">Free shipping progress</h2>
                    <p className="mt-1 text-sm text-zinc-400">{savingsMessage}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-400">Cart value</div>
                    <div className="text-lg font-semibold">{formatINR(subtotal)}</div>
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-red-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-xs text-zinc-500">
                  <span>{formatINR(0)}</span>
                  <span>{formatINR(shippingThreshold)}</span>
                </div>
              </div>

              <div className="space-y-4">
                {items.map((item: any) => {
                  const product = item.product;
                  const title = getProductTitle(product);
                  const brand = getProductBrand(product);
                  const image = getProductImage(product);
                  const price = Number(product?.price || 0);
                  const lineTotal = price * item.quantity;

                  return (
                    <div
                      key={product._id}
                      className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/20 transition hover:border-white/15 hover:bg-white/[0.055]"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-shrink-0">
                          {image ? (
                            <img
                              src={image}
                              alt={title}
                              className="h-28 w-28 rounded-2xl border border-white/10 bg-white/5 object-cover"
                            />
                          ) : (
                            <div className="grid h-28 w-28 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 text-2xl font-semibold text-zinc-300">
                              {title.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              {brand ? (
                                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                  {brand}
                                </p>
                              ) : null}
                              <h3 className="mt-1 truncate text-lg font-semibold text-white">
                                {title}
                              </h3>

                              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                                <span>Unit price: {formatINR(price)}</span>
                                {product?.size ? <span>Size: {product.size}</span> : null}
                                {product?.color ? <span>Color: {product.color}</span> : null}
                              </div>
                            </div>

                            <div className="text-left lg:text-right">
                              <div className="text-sm text-zinc-400">Line total</div>
                              <div className="text-xl font-semibold">{formatINR(lineTotal)}</div>
                            </div>
                          </div>

                          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="inline-flex w-fit items-center rounded-2xl border border-white/10 bg-black/20 p-1">
                              <button
                                type="button"
                                onClick={() =>
                                  item.quantity <= 1
                                    ? removeFromCart(product._id)
                                    : updateQuantity(product._id, item.quantity - 1)
                                }
                                className="grid h-10 w-10 place-items-center rounded-xl text-lg text-zinc-300 transition hover:bg-white/10 hover:text-white"
                                aria-label={`Decrease quantity of ${title}`}
                              >
                                −
                              </button>

                              <span className="min-w-12 px-4 text-center text-sm font-medium text-white">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() => updateQuantity(product._id, item.quantity + 1)}
                                className="grid h-10 w-10 place-items-center rounded-xl text-lg text-zinc-300 transition hover:bg-white/10 hover:text-white"
                                aria-label={`Increase quantity of ${title}`}
                              >
                                +
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => removeFromCart(product._id)}
                                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-200"
                              >
                                Remove
                              </button>

                              <Link
                                to="/products"
                                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10"
                              >
                                Continue Shopping
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="lg:sticky lg:top-6 h-fit">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Review your cost breakdown before checkout.
                </p>

                <div className="mt-5 space-y-3 border-b border-white/10 pb-5 text-sm">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-300">
                    <span>Discount</span>
                    <span className={discount > 0 ? "text-emerald-400" : ""}>
                      {discount > 0 ? `- ${formatINR(discount)}` : formatINR(0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-300">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-300">
                    <span>Estimated tax</span>
                    <span>{formatINR(tax)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5">
                  <span className="text-base font-medium text-zinc-300">Total</span>
                  <span className="text-2xl font-semibold">{formatINR(total)}</span>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Promo code
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promo.code}
                      onChange={(e) =>
                        setPromo((prev) => ({
                          ...prev,
                          code: e.target.value,
                          message: "",
                          applied: false,
                        }))
                      }
                      placeholder="Enter code"
                      className="h-12 flex-1 rounded-2xl border border-white/10 bg-[#111113] px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500/40"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="h-12 rounded-2xl bg-red-500 px-4 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      Apply
                    </button>
                  </div>

                  {promo.message ? (
                    <div
                      className={`mt-3 text-sm ${
                        promo.applied ? "text-emerald-400" : "text-zinc-400"
                      }`}
                    >
                      {promo.message}
                      {promo.applied ? (
                        <button
                          type="button"
                          onClick={removePromo}
                          className="ml-3 text-zinc-300 underline decoration-white/30 underline-offset-4 hover:text-white"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 space-y-3 text-sm text-zinc-400">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <div>
                      <p className="font-medium text-zinc-200">Secure checkout</p>
                      <p className="mt-1 leading-6">
                        Payments are protected with standard encryption and checkout best practices.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div>
                      <p className="font-medium text-zinc-200">Fast delivery</p>
                      <p className="mt-1 leading-6">
                        Estimated delivery updates will appear at checkout.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    to="/checkout"
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-red-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    Proceed to Checkout
                  </Link>

                  <Link
                    to="/products"
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}