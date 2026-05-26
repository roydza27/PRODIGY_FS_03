export type SellerApplicationStatus =
  | "none"
  | "applied"
  | "approved"
  | "rejected"
  | "suspended";

export type SellerApplicationFormData = {
  shopName: string;
  shopDescription: string;
  businessEmail: string;
  businessPhone: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankCode: string;
  businessRegistration: string;
  gstNumber?: string;
};

export type SellerApplication = {
  userId: string;
  name: string;
  email: string;
  sellerStatus: SellerApplicationStatus;
  sellerAppliedAt?: string;
  sellerApprovedAt?: string;
  sellerRejectedAt?: string;
  sellerRejectionReason?: string;
  sellerInfo?: SellerApplicationFormData;
};

export type SellerApplicationResponse = {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    sellerStatus: SellerApplicationStatus;
  };
};

export type SellerApplicationStatusResponse = {
  success: boolean;
  data: SellerApplication | null;
};