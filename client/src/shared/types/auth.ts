export type Role = "user" | "seller" | "admin";

export type SellerStatus = "none" | "applied" | "approved" | "rejected" | "suspended";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  sellerStatus?: SellerStatus;
  sellerInfo?: {
    shopName?: string;
    shopDescription?: string;
    businessEmail?: string;
    businessPhone?: string;
  };
  sellerAppliedAt?: string;
  sellerApprovedAt?: string;
  sellerRejectedAt?: string;
  sellerRejectionReason?: string;
};