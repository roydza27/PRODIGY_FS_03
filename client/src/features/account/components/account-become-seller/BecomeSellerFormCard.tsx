import { useState } from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import type { SellerApplicationFormData } from "../../types/account-become-seller.types";

type Props = {
  initialValue?: Partial<SellerApplicationFormData>;
  isSubmitting?: boolean;
  onSubmit: (data: SellerApplicationFormData) => Promise<void> | void;
};

const emptyForm: SellerApplicationFormData = {
  shopName: "",
  shopDescription: "",
  businessEmail: "",
  businessPhone: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankCode: "",
  businessRegistration: "",
  gstNumber: "",
};

export default function BecomeSellerFormCard({
  initialValue,
  isSubmitting,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<SellerApplicationFormData>({
    ...emptyForm,
    ...initialValue,
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const update = (key: keyof SellerApplicationFormData, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    const requiredFields: Array<keyof SellerApplicationFormData> = [
      "shopName",
      "shopDescription",
      "businessEmail",
      "businessPhone",
      "bankAccountName",
      "bankAccountNumber",
      "bankCode",
      "businessRegistration",
    ];

    const missing = requiredFields.find((field) => !String(form[field] ?? "").trim());
    if (missing) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    await onSubmit({
      ...form,
      gstNumber: form.gstNumber?.trim() || undefined,
    });
  };

  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-lg">Apply to become a seller</CardTitle>
      </CardHeader>

      <CardContent className="pt-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {localError ? (
            <Alert className="border-red-800 bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-200" />
              <AlertDescription className="text-red-100">
                {localError}
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              value={form.shopName}
              onChange={(e) => update("shopName", e.target.value)}
              placeholder="Shop name"
              className="h-11 border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
            />
            <Input
              value={form.businessEmail}
              onChange={(e) => update("businessEmail", e.target.value)}
              placeholder="Business email"
              type="email"
              className="h-11 border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
            />
            <Input
              value={form.businessPhone}
              onChange={(e) => update("businessPhone", e.target.value)}
              placeholder="Business phone"
              className="h-11 border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
            />
            <Input
              value={form.bankAccountName}
              onChange={(e) => update("bankAccountName", e.target.value)}
              placeholder="Bank account name"
              className="h-11 border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
            />
            <Input
              value={form.bankAccountNumber}
              onChange={(e) => update("bankAccountNumber", e.target.value)}
              placeholder="Bank account number"
              className="h-11 border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
            />
            <Input
              value={form.bankCode}
              onChange={(e) => update("bankCode", e.target.value)}
              placeholder="Bank code / IFSC"
              className="h-11 border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
            />
            <Input
              value={form.businessRegistration}
              onChange={(e) => update("businessRegistration", e.target.value)}
              placeholder="Business registration"
              className="h-11 border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
            />
            <Input
              value={form.gstNumber || ""}
              onChange={(e) => update("gstNumber", e.target.value)}
              placeholder="GST number (optional)"
              className="h-11 border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
            />
          </div>

          <Textarea
            value={form.shopDescription}
            onChange={(e) => update("shopDescription", e.target.value)}
            placeholder="Tell buyers about your shop"
            className="min-h-32 border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}