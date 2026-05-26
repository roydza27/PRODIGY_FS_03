export interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
}

// Seller Application Types
export interface SellerApplicationFormData {
  shopName: string;
  shopDescription: string;
  businessEmail: string;
  businessPhone: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankCode: string;
  businessRegistration: string;
  gstNumber?: string;
}

export interface SellerApplication {
  userId: string;
  shopName: string;
  shopDescription: string;
  businessEmail: string;
  businessPhone: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankCode: string;
  businessRegistration: string;
  gstNumber?: string;
  sellerStatus: "applied" | "approved" | "rejected" | "suspended";
  sellerAppliedAt?: string;
  sellerApprovedAt?: string;
  sellerRejectedAt?: string;
  sellerRejectionReason?: string;
}

export interface SellerApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    sellerStatus: string;
  };
}

export interface SellerDashboard {
  seller: {
    id: string;
    name: string;
    email: string;
    shopName: string;
    shopDescription: string;
    sellerStatus: string;
  };
  stats: SellerStats;
}

/**
 * Admin seller application item
 * Matches the shape used in admin screens and drawers/modals.
 */
export interface AdminSellerApplicationItem {
  userId: string;
  name: string;
  email: string;
  sellerStatus: "applied" | "approved" | "rejected" | "suspended";
  sellerAppliedAt?: string;
  sellerApprovedAt?: string;
  sellerRejectedAt?: string;
  sellerRejectionReason?: string;
  sellerInfo: SellerApplicationFormData;
}

export interface AdminSellerApplicationsResponse {
  success: boolean;
  applications: AdminSellerApplicationItem[];
}

export interface AdminSellerApplicationResponse {
  success: boolean;
  application: AdminSellerApplicationItem;
}

export interface SellerApprovalPayload {
  userId: string;
  approve: boolean;
  rejectionReason?: string;
}

export interface ApprovalResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    sellerStatus: string;
  };
}

export interface AdminSellerApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export type AdminSellerApplicationFilterStatus =
  | "all"
  | "applied"
  | "approved"
  | "rejected"
  | "suspended";