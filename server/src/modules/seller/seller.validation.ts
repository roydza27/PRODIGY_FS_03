import { z } from "zod";

export const sellerApplicationSchema = z.object({
  body: z.object({
    shopName: z.string().min(3, "Shop name must be at least 3 characters").trim(),
    shopDescription: z
      .string()
      .min(10, "Shop description must be at least 10 characters")
      .trim(),
    businessEmail: z.string().email("Invalid business email").trim().toLowerCase(),
    businessPhone: z.string().regex(/^[0-9+\-\s()]+$/, "Invalid phone number"),
    bankAccountName: z.string().min(5, "Bank account name is required").trim(),
    bankAccountNumber: z
      .string()
      .regex(/^[0-9]+$/, "Bank account number must contain only digits"),
    bankCode: z.string().min(3, "Bank code is required").trim(),
    businessRegistration: z.string().min(5, "Business registration is required").trim(),
    gstNumber: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[0-9A-Z]{15}$/.test(val),
        "Invalid GST number format"
      ),
  }),
});

export const sellerApprovalSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User ID is required"),
    approve: z.boolean(),
    rejectionReason: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 5, "Rejection reason must be at least 5 characters"),
  }),
});

export type SellerApplicationRequest = z.infer<typeof sellerApplicationSchema>["body"];
export type SellerApprovalRequest = z.infer<typeof sellerApprovalSchema>["body"];
