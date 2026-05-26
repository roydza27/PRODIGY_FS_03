
export type PaymentMethodType = "card" | "upi" | "bank";

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

export type BillingPaymentMethod = {
  id: string;
  type: PaymentMethodType;
  label: string;
  isDefault?: boolean;

  // Card
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;

  // UPI
  upiId?: string;

  // Bank
  bankName?: string;
  accountHolder?: string;
  maskedAccount?: string;

  updatedAt?: string;
};

export type BillingProfile = {
  billingAddress?: BillingAddress;
  paymentMethods: BillingPaymentMethod[];
  defaultMethodId?: string;
};