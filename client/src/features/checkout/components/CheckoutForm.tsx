import { useState } from "react";
import type { CheckoutFormData } from "../types/checkout.types";

const initialForm: CheckoutFormData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  paymentMethod: "cod",
};

type Props = {
  onSubmit: (data: CheckoutFormData) => void | Promise<void>;
  disabled?: boolean;
};

export default function CheckoutForm({ onSubmit, disabled }: Props) {
  const [form, setForm] = useState<CheckoutFormData>(initialForm);

  const update = <K extends keyof CheckoutFormData>(
    key: K,
    value: CheckoutFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6"
    >
      <h2 className="text-lg font-semibold text-white">Shipping Details</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          placeholder="Full Name"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
        />
        <input
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="Email"
          type="email"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
        />
        <input
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="Phone"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
        />
        <input
          value={form.country}
          onChange={(e) => update("country", e.target.value)}
          placeholder="Country"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
        />
        <input
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="Address"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500 sm:col-span-2"
        />
        <input
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
          placeholder="City"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
        />
        <input
          value={form.state}
          onChange={(e) => update("state", e.target.value)}
          placeholder="State"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
        />
        <input
          value={form.postalCode}
          onChange={(e) => update("postalCode", e.target.value)}
          placeholder="Postal Code"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500 sm:col-span-2"
        />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-zinc-200">Payment Method</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => update("paymentMethod", "cod")}
            className={[
              "rounded-xl border px-4 py-3 text-sm transition",
              form.paymentMethod === "cod"
                ? "border-red-500 bg-red-500 text-white"
                : "border-white/10 bg-black/20 text-zinc-300",
            ].join(" ")}
          >
            Cash on Delivery
          </button>
          <button
            type="button"
            onClick={() => update("paymentMethod", "card")}
            className={[
              "rounded-xl border px-4 py-3 text-sm transition",
              form.paymentMethod === "card"
                ? "border-red-500 bg-red-500 text-white"
                : "border-white/10 bg-black/20 text-zinc-300",
            ].join(" ")}
          >
            Card
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
}