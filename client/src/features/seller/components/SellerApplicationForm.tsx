import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import type { SellerApplicationFormData } from "../types/seller.types";

// Validation schema
const sellerApplicationSchema = z.object({
  shopName: z.string().min(3, "Shop name must be at least 3 characters"),
  shopDescription: z.string().min(10, "Shop description must be at least 10 characters"),
  businessEmail: z.string().email("Invalid business email"),
  businessPhone: z.string().regex(/^[0-9+\-\s()]+$/, "Invalid phone number"),
  bankAccountName: z.string().min(5, "Bank account name is required"),
  bankAccountNumber: z.string().regex(/^[0-9]+$/, "Bank account number must contain only digits"),
  bankCode: z.string().min(3, "Bank code is required"),
  businessRegistration: z.string().min(5, "Business registration number is required"),
  gstNumber: z.string().optional().refine(
    (val) => !val || /^[0-9A-Z]{15}$/.test(val),
    "Invalid GST number format"
  ),
});

type FormData = z.infer<typeof sellerApplicationSchema>;

interface SellerApplicationFormProps {
  onSubmit: (data: SellerApplicationFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function SellerApplicationForm({
  onSubmit,
  isLoading = false,
}: SellerApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(sellerApplicationSchema),
  });

  return (
    <Card className="w-full bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>Shop Information</CardTitle>
        <CardDescription>
          Provide details about your shop and banking information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Shop Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Shop Details</h3>

            <div className="space-y-2">
              <Label htmlFor="shopName" className="text-zinc-200">
                Shop Name *
              </Label>
              <Input
                {...register("shopName")}
                id="shopName"
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Enter your shop name"
              />
              {errors.shopName && (
                <p className="text-sm text-red-500">{errors.shopName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopDescription" className="text-zinc-200">
                Shop Description *
              </Label>
              <Textarea
                {...register("shopDescription")}
                id="shopDescription"
                className="bg-zinc-800 border-zinc-700 text-white min-h-24"
                placeholder="Describe your shop business"
              />
              {errors.shopDescription && (
                <p className="text-sm text-red-500">{errors.shopDescription.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Contact Information</h3>

            <div className="space-y-2">
              <Label htmlFor="businessEmail" className="text-zinc-200">
                Business Email *
              </Label>
              <Input
                {...register("businessEmail")}
                id="businessEmail"
                type="email"
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="business@example.com"
              />
              {errors.businessEmail && (
                <p className="text-sm text-red-500">{errors.businessEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessPhone" className="text-zinc-200">
                Business Phone *
              </Label>
              <Input
                {...register("businessPhone")}
                id="businessPhone"
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="+1 (555) 000-0000"
              />
              {errors.businessPhone && (
                <p className="text-sm text-red-500">{errors.businessPhone.message}</p>
              )}
            </div>
          </div>

          {/* Banking Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Banking Information</h3>

            <div className="space-y-2">
              <Label htmlFor="bankAccountName" className="text-zinc-200">
                Bank Account Name *
              </Label>
              <Input
                {...register("bankAccountName")}
                id="bankAccountName"
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Name on bank account"
              />
              {errors.bankAccountName && (
                <p className="text-sm text-red-500">{errors.bankAccountName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber" className="text-zinc-200">
                Bank Account Number *
              </Label>
              <Input
                {...register("bankAccountNumber")}
                id="bankAccountNumber"
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Enter bank account number"
              />
              {errors.bankAccountNumber && (
                <p className="text-sm text-red-500">{errors.bankAccountNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankCode" className="text-zinc-200">
                Bank Code / IFSC *
              </Label>
              <Input
                {...register("bankCode")}
                id="bankCode"
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="IFSC or bank code"
              />
              {errors.bankCode && (
                <p className="text-sm text-red-500">{errors.bankCode.message}</p>
              )}
            </div>
          </div>

          {/* Business Registration Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Business Details</h3>

            <div className="space-y-2">
              <Label htmlFor="businessRegistration" className="text-zinc-200">
                Business Registration Number *
              </Label>
              <Input
                {...register("businessRegistration")}
                id="businessRegistration"
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Enter registration number"
              />
              {errors.businessRegistration && (
                <p className="text-sm text-red-500">{errors.businessRegistration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstNumber" className="text-zinc-200">
                GST Number (Optional)
              </Label>
              <Input
                {...register("gstNumber")}
                id="gstNumber"
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="15-digit GST number"
              />
              {errors.gstNumber && (
                <p className="text-sm text-red-500">{errors.gstNumber.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
