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

export interface AdminSellerApplicationItem {
  userId: string;
  name: string;
  email: string;
  shopName: string;
  shopDescription: string;
  businessEmail: string;
  businessPhone: string;
  sellerStatus: "applied" | "approved" | "rejected" | "suspended";
  sellerAppliedAt: string;
  sellerApprovedAt?: string;
  sellerRejectedAt?: string;
  sellerRejectionReason?: string;
  sellerInfo: SellerApplicationFormData;
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
