// Seller application request/response types

export interface SellerApplicationRequest {
  shopName: string;
  shopDescription: string;
  businessEmail: string;
  businessPhone: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankCode: string;
  businessRegistration: string;
  gstNumber: string;
}

export interface SellerApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    sellerStatus: string;
    sellerInfo: SellerApplicationRequest;
  };
}

export interface SellerApprovalRequest {
  userId: string;
  approve: boolean;
  rejectionReason?: string;
}

export interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
}

export interface SellerDashboardData {
  seller: {
    name: string;
    email: string;
    shopName: string;
    shopDescription: string;
    sellerStatus: string;
  };
  stats: SellerStats;
}
