import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/features/cart/context/CartContext";
import CheckoutForm from "../components/CheckoutForm";
import CheckoutSummary from "../components/CheckoutSummary";
import type { CheckoutFormData } from "../types/checkout.types";
import { orderService } from "../services/order.service";
import { toast } from "sonner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CheckoutFormData): Promise<void> => {
    try {
      setIsSubmitting(true);

      const res = await orderService.createOrder(data);

      await clearCart();
      toast.success("Order placed successfully");

      console.log("Order:", res.order);
      console.log("Shipment:", res.shipment);

      navigate("/account/orders");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to place order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl text-left">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-zinc-300">
              Secure checkout
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Checkout
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Review your details, confirm your order, and complete payment with a smooth checkout experience.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-xs text-zinc-400 sm:w-fit sm:text-sm">
            <div className="rounded-xl bg-red-500 px-3 py-2 text-center font-medium text-white">
              Shipping
            </div>
            <div className="rounded-xl px-3 py-2 text-center">Review</div>
            <div className="rounded-xl px-3 py-2 text-center">Payment</div>
          </div>
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
                  <path
                    d="M3 3h2l.4 2M7 13h10l3-8H6.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 13l-1.2-8H3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 13l1.2 5.2a1 1 0 0 0 1 .8h7.8a1 1 0 0 0 1-.8L19 13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="21" r="1.2" fill="currentColor" />
                  <circle cx="17" cy="21" r="1.2" fill="currentColor" />
                </svg>
              </div>

              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Add products to your cart before starting checkout.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-2xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Browse Products
                </Link>
                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
                >
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Shipping information</h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      Enter the details needed to deliver your order safely.
                    </p>
                  </div>

                  <div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-400">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Step 1
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      Enter address
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Step 2
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      Review order
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Step 3
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      Place payment
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4 sm:p-5">
                  <CheckoutForm onSubmit={handleSubmit} disabled={isSubmitting} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5 text-zinc-300"
                      >
                        <path
                          d="M20 7l-8 10-4-4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Protected checkout</p>
                      <p className="text-sm text-zinc-400">
                        Secure order placement with standard payment safeguards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5 text-zinc-300"
                      >
                        <path
                          d="M4 7h16M6 7l1 13h10l1-13"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 7V5a3 3 0 0 1 6 0v2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Order updates</p>
                      <p className="text-sm text-zinc-400">
                        Track order progress from your account after purchase.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-6 h-fit">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      Final review before placing the order.
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
                    Live
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-1">
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 w-4/5 rounded-full bg-red-500" />
                  </div>
                  <div className="mt-3 flex items-center justify-between px-2 pb-1 text-xs text-zinc-500">
                    <span>Cart</span>
                    <span>Checkout</span>
                    <span>Done</span>
                  </div>
                </div>

                <div className="mt-5">
                  <CheckoutSummary />
                </div>

                <div className="mt-5 space-y-3 text-sm text-zinc-400">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <div>
                      <p className="font-medium text-zinc-200">Fast processing</p>
                      <p className="mt-1 leading-6">
                        Orders are submitted instantly after confirmation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div>
                      <p className="font-medium text-zinc-200">Easy support</p>
                      <p className="mt-1 leading-6">
                        Need help after placing the order? Visit your account orders page.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-red-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                  </button>

                  <Link
                    to="/cart"
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
                  >
                    Back to Cart
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