"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/features/cart/context/CartContext";
import CheckoutForm from "../components/CheckoutForm";
import CheckoutSummary from "../components/CheckoutSummary";
import type { CheckoutFormData } from "../types/checkout.types";
import { orderService } from "../services/order.service";
import { toast } from "sonner";

type CheckoutStep = 1 | 2;
type PaymentMethod = "card" | "upi" | "cod";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  
  // Step & Data Management
  const [step, setStep] = useState<CheckoutStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingData, setShippingData] = useState<CheckoutFormData | null>(null);
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [upiId, setUpiId] = useState("");

  // Triggered when the shipping form (Step 1) is submitted
  const handleShippingSubmit = (data: CheckoutFormData) => {
    setShippingData(data);
    setStep(2);
    toast.success("Shipping details confirmed. Please select a payment method.");
  };

  // Triggered from the sidebar button when on Step 2
  const handleFinalSubmit = async () => {
    if (!shippingData) {
      toast.error("Shipping details are missing.");
      setStep(1);
      return;
    }

    if (paymentMethod === "upi" && !upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g., username@bank)");
      return;
    }

    try {
      setIsSubmitting(true);

      // Append the mock payment data to your order payload
      const payload = {
        ...shippingData,
        paymentDetails: {
          method: paymentMethod,
          upiId: paymentMethod === "upi" ? upiId : undefined,
          isMockVerified: true,
        },
      };

      const res = await orderService.createOrder(payload);

      await clearCart();
      toast.success(
        paymentMethod === "cod" 
          ? "Order placed! Pay via Cash on Delivery." 
          : "Payment verified! Order placed successfully."
      );

      navigate("/account/orders");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl text-left">
        
        {/* Header & Tab Selector */}
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-zinc-300">
              Secure checkout • Step {step} of 2
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Checkout
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              {step === 1 
                ? "Review your details, confirm your order, and complete payment with a smooth checkout experience."
                : "Select a payment method to finalize your purchase. No actual charges will be made."}
            </p>
          </div>

          {/* FIXED: Interactive Tabs */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-xs text-zinc-400 sm:w-fit sm:text-sm">
            <button 
              onClick={() => setStep(1)}
              className={`rounded-xl px-3 py-2 text-center font-medium transition-colors ${step === 1 ? "bg-red-500 text-white" : "hover:bg-white/10 hover:text-white"}`}
            >
              Shipping
            </button>
            <button 
              onClick={() => { if(shippingData) setStep(2) }}
              className={`rounded-xl px-3 py-2 text-center font-medium transition-colors ${step === 2 ? "bg-red-500 text-white" : shippingData ? "hover:bg-white/10 hover:text-white" : "cursor-not-allowed opacity-50"}`}
            >
              Payment
            </button>
            <div className="rounded-xl px-3 py-2 text-center opacity-50 cursor-not-allowed">Done</div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="grid min-h-[420px] place-items-center rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-10 w-10 text-zinc-300">
                  <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 13l-1.2-8H3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 13l1.2 5.2a1 1 0 0 0 1 .8h7.8a1 1 0 0 0 1-.8L19 13" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="21" r="1.2" fill="currentColor" />
                  <circle cx="17" cy="21" r="1.2" fill="currentColor" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">Add products to your cart before starting checkout.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/products" className="inline-flex items-center justify-center rounded-2xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600">
                  Browse Products
                </Link>
                <Link to="/cart" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10">
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              
              {/* STEP 1: SHIPPING FORM */}
              {step === 1 && (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Shipping information</h2>
                      <p className="mt-1 text-sm text-zinc-400">Enter the details needed to deliver your order safely.</p>
                    </div>
                    <div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-400">
                      {items.length} item{items.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4 sm:p-5">
                    {/* The form validates itself, then triggers handleShippingSubmit */}
                    <CheckoutForm onSubmit={handleShippingSubmit} disabled={isSubmitting} />
                  </div>
                </div>
              )}

              {/* STEP 2: PAYMENT METHOD */}
              {step === 2 && (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20">
                  <h2 className="text-lg font-semibold mb-1">Payment Method</h2>
                  <p className="text-sm text-zinc-400 mb-6">Mock verification only. No real funds will be transferred.</p>

                  <div className="space-y-3">
                    {/* Credit Card Mock */}
                    <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-black/20 hover:border-white/20'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 accent-red-500" />
                      <div>
                        <p className="font-medium text-white">Credit / Debit Card</p>
                        <p className="text-xs text-zinc-400 mt-0.5">Mock verification only.</p>
                      </div>
                    </label>

                    {/* UPI Integration */}
                    <label className={`flex flex-col gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-black/20 hover:border-white/20'}`}>
                      <div className="flex items-center gap-4">
                        <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="h-4 w-4 accent-red-500" />
                        <div>
                          <p className="font-medium text-white">UPI Payment</p>
                          <p className="text-xs text-zinc-400 mt-0.5">Google Pay, PhonePe, Paytm</p>
                        </div>
                      </div>
                      {paymentMethod === 'upi' && (
                        <div className="pl-8 pt-2">
                          <input
                            type="text"
                            placeholder="Enter UPI ID (e.g. yourname@okaxis)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none"
                          />
                        </div>
                      )}
                    </label>

                    {/* Cash on Delivery */}
                    <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-black/20 hover:border-white/20'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-4 w-4 accent-red-500" />
                      <div>
                        <p className="font-medium text-white">Cash on Delivery (COD)</p>
                        <p className="text-xs text-zinc-400 mt-0.5">Pay securely when your package arrives.</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-zinc-300">
                        <path d="M20 7l-8 10-4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Protected checkout</p>
                      <p className="text-sm text-zinc-400">Secure order placement with standard payment safeguards.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-zinc-300">
                        <path d="M4 7h16M6 7l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 7V5a3 3 0 0 1 6 0v2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Order updates</p>
                      <p className="text-sm text-zinc-400">Track order progress from your account after purchase.</p>
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
                    <p className="mt-1 text-sm text-zinc-400">Final review before placing the order.</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">Live</div>
                </div>

                {/* FIXED: Dynamic Progress Bar */}
                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-1">
                  <div className="h-2 rounded-full bg-white/10">
                    <div 
                      className="h-2 rounded-full bg-red-500 transition-all duration-500 ease-out" 
                      style={{ width: step === 1 ? '50%' : '90%' }} 
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between px-2 pb-1 text-xs text-zinc-500">
                    <span className={step >= 1 ? "text-white font-medium" : ""}>Shipping</span>
                    <span className={step === 2 ? "text-white font-medium" : ""}>Payment</span>
                    <span>Done</span>
                  </div>
                </div>

                <div className="mt-5">
                  <CheckoutSummary />
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {/* Dynamic Submission Buttons */}
                  {step === 1 ? (
                    <button
                      type="submit"
                      form="checkout-form"
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-red-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Continue to Payment
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-red-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? "Processing..." : "Confirm & Place Order"}
                    </button>
                  )}

                  <Link to="/cart" className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-medium text-zinc-200 transition hover:bg-white/10">
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