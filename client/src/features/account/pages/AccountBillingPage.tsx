"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Download,
  EllipsisVertical,
  Landmark,
  Plus,
  ShieldCheck,
  Smartphone,
  Trash2,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

type PaymentMethodType = "card" | "upi" | "bank";

type BillingAddress = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

type BillingPaymentMethod = {
  id: string;
  type: PaymentMethodType;
  label: string;
  isDefault?: boolean;
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  upiId?: string;
  bankName?: string;
  accountHolder?: string;
  maskedAccount?: string;
  updatedAt?: string;
};

type BillingProfile = {
  billingAddress?: BillingAddress;
  paymentMethods: BillingPaymentMethod[];
  defaultMethodId?: string;
};

const MOCK_BILLING_PROFILE: BillingProfile = {
  billingAddress: {
    fullName: "Royal D'Souza",
    email: "royal@example.com",
    phone: "+91 98765 43210",
    address: "12B, Green Park Residency",
    city: "Mangalore",
    state: "Karnataka",
    postalCode: "575001",
    country: "India",
  },
  defaultMethodId: "card-1",
  paymentMethods: [
    // {
    //   id: "card-1",
    //   type: "card",
    //   label: "HDFC Platinum Card",
    //   isDefault: true,
    //   brand: "visa",
    //   last4: "4242",
    //   expiryMonth: 12,
    //   expiryYear: 2028,
    //   updatedAt: "2026-05-18T10:30:00.000Z",
    // },
    // {
    //   id: "upi-1",
    //   type: "upi",
    //   label: "Primary UPI",
    //   upiId: "royal@upi",
    //   updatedAt: "2026-05-19T08:15:00.000Z",
    // },
    {
      id: "bank-1",
      type: "bank",
      label: "Savings Account",
      bankName: "State Bank of India",
      accountHolder: "Royal D'Souza",
      maskedAccount: "XXXX XXXX 2184",
      updatedAt: "2026-05-20T14:45:00.000Z",
    },
  ],
};

function formatDate(value?: string) {
  if (!value) return "Not updated";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not updated";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getMethodIcon(type: PaymentMethodType) {
  switch (type) {
    case "card":
      return CreditCard;
    case "upi":
      return Smartphone;
    case "bank":
      return Landmark;
    default:
      return WalletCards;
  }
}

function getMethodLabel(method: BillingPaymentMethod) {
  if (method.type === "card") {
    const brand = method.brand ? method.brand.toUpperCase() : "CARD";
    const last4 = method.last4 ? `•••• ${method.last4}` : "••••";
    return `${brand} ${last4}`;
  }

  if (method.type === "upi") {
    return method.upiId || "UPI";
  }

  if (method.type === "bank") {
    return method.maskedAccount || method.bankName || "Bank account";
  }

  return method.label;
}

function MethodBadge({ type }: { type: PaymentMethodType }) {
  const styles =
    type === "card"
      ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
      : type === "upi"
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : "bg-violet-500/10 text-violet-400 border-violet-500/20";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${styles}`}
    >
      {type}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <WalletCards className="h-6 w-6 text-zinc-300" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">No payment methods saved</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">
        Add a card, UPI ID, or bank account to make future checkout faster.
      </p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-1 text-sm text-white">{value}</p>
    </div>
  );
}

export default function AccountBillingPage() {
  const [profile] = useState<BillingProfile>(MOCK_BILLING_PROFILE);
  const [methodFilter, setMethodFilter] = useState<PaymentMethodType | "all">("all");

  const paymentMethods = profile.paymentMethods;

  const filteredMethods = useMemo(() => {
    if (methodFilter === "all") return paymentMethods;
    return paymentMethods.filter((m) => m.type === methodFilter);
  }, [paymentMethods, methodFilter]);

  const defaultMethod =
    paymentMethods.find((m) => m.isDefault) ||
    paymentMethods.find((m) => m.id === profile.defaultMethodId) ||
    null;

  const billingAddress = profile.billingAddress;

  const handleAction = (action: string) => {
    toast.message(`${action} is not connected yet. This is mock data for now.`);
  };

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl text-left">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium tracking-wide text-zinc-300">
              Billing & payments
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Manage Billing
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Save cards, UPI IDs, and bank details securely. This page is using mock billing data until the backend is ready.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-white/10 bg-transparent"
              onClick={() => handleAction("Add card")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Add Card
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-white/10 bg-transparent"
              onClick={() => handleAction("Add UPI")}
            >
              <Smartphone className="mr-2 h-4 w-4" />
              Add UPI
            </Button>
            <Button
              type="button"
              className="rounded-2xl bg-[#DB4444] text-white hover:bg-[#c53a3a]"
              onClick={() => handleAction("Add bank account")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-6">
<Card className="border-white/10 bg-white/[0.03] shadow-none">
  <CardHeader className="border-b border-white/10">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <CardTitle className="text-xl font-semibold text-white">
          Saved payment methods
        </CardTitle>
        <p className="mt-1 text-sm text-zinc-400">
          Stored payment options available in your account.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "card", "upi", "bank"] as const).map((type) => {
          const active = methodFilter === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => setMethodFilter(type)}
              className={[
                "rounded-full border px-3 py-1.5 text-sm transition",
                active
                  ? "border-[#DB4444]/30 bg-[#DB4444]/10 text-white"
                  : "border-white/10 bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05] hover:text-white",
              ].join(" ")}
            >
              <span className="capitalize">{type}</span>
            </button>
          );
        })}
      </div>
    </div>
  </CardHeader>

  <CardContent className="space-y-4 pt-6">
    {filteredMethods.length === 0 ? (
      <EmptyState />
    ) : (
      filteredMethods.map((method) => {
        const Icon = getMethodIcon(method.type);
        const label = getMethodLabel(method);

        return (
          <div
            key={method.id}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:bg-white/[0.04]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#111113]">
                  <Icon className="h-5 w-5 text-zinc-300" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-base font-semibold text-white">
                      {method.label}
                    </p>

                    {method.isDefault ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Default
                      </span>
                    ) : null}

                    <MethodBadge type={method.type} />
                  </div>

                  <p className="mt-2 text-sm text-zinc-400">{label}</p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">
                      Updated {formatDate(method.updatedAt)}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">
                      Securely stored
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.05] hover:text-white"
                  onClick={() => handleAction(`Edit ${method.label}`)}
                >
                  <EllipsisVertical className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.05] hover:text-white"
                  onClick={() => handleAction(`Remove ${method.label}`)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {method.type === "card" ? (
                <>
                  <InfoBox label="Card brand" value={method.brand || "Not available"} />
                  <InfoBox
                    label="Last 4 digits"
                    value={method.last4 ? `•••• ${method.last4}` : "Not available"}
                  />
                  <InfoBox
                    label="Expiry"
                    value={
                      method.expiryMonth && method.expiryYear
                        ? `${String(method.expiryMonth).padStart(2, "0")}/${method.expiryYear}`
                        : "Not available"
                    }
                  />
                </>
              ) : method.type === "upi" ? (
                <>
                  <InfoBox label="UPI ID" value={method.upiId || "Not available"} />
                  <InfoBox label="Type" value="UPI payment" />
                  <InfoBox label="Security" value="Tokenized" />
                </>
              ) : (
                <>
                  <InfoBox label="Bank" value={method.bankName || "Not available"} />
                  <InfoBox
                    label="Account"
                    value={method.maskedAccount || "Not available"}
                  />
                  <InfoBox
                    label="Account holder"
                    value={method.accountHolder || "Not available"}
                  />
                </>
              )}
            </div>
          </div>
        );
      })
    )}
  </CardContent>
</Card>

            <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-xl">Billing address</CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                {billingAddress ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoBox label="Full name" value={billingAddress.fullName || "Not provided"} />
                    <InfoBox label="Email" value={billingAddress.email || "Not provided"} />
                    <InfoBox label="Phone" value={billingAddress.phone || "Not provided"} />
                    <InfoBox label="Country" value={billingAddress.country || "Not provided"} />
                    <InfoBox
                      label="Address"
                      value={billingAddress.address || "Not provided"}
                    />
                    <InfoBox
                      label="City / State"
                      value={[
                        billingAddress.city,
                        billingAddress.state,
                        billingAddress.postalCode,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Not provided"}
                    />
                  </div>
                ) : (
                  <EmptyState />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-xl">Default payment method</CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                {defaultMethod ? (
                  <div className="rounded-[1.75rem] border border-white/10 bg-[#111113] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                        {(() => {
                          const Icon = getMethodIcon(defaultMethod.type);
                          return <Icon className="h-5 w-5 text-zinc-200" />;
                        })()}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white">
                          {defaultMethod.label}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {getMethodLabel(defaultMethod)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
                      This method is set as default for checkout in the mock UI.
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                    No default payment method selected.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-xl">Security</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pt-6 text-sm text-zinc-400">
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-400" />
                  <p>
                    Only masked payment details are shown here.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <Download className="mt-0.5 h-4 w-4 text-sky-400" />
                  <p>
                    Add invoices and history later when your backend is ready.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              type="button"
              className="w-full rounded-2xl h-12 bg-[#DB4444] text-white hover:bg-[#c53a3a]"
              onClick={() => handleAction("Add new payment method")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Payment Method
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}