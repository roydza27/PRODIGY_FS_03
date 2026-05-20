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

      await orderService.createOrder(data);

      await clearCart();

      toast.success("Order placed successfully");
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
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold sm:text-3xl">Checkout</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Complete your shipping details and place the order.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-zinc-400">
            Your cart is empty.
            <div className="mt-5">
              <Link
                to="/products"
                className="inline-flex rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <CheckoutForm onSubmit={handleSubmit} disabled={isSubmitting} />
            <CheckoutSummary />
          </div>
        )}
      </div>
    </div>
  );
}