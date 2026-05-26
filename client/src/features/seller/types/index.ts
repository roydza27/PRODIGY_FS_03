export interface SellerApplicationData {
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

export interface SellerDashboardData {
  seller: {
    name: string;
    email: string;
    shopName: string;
    shopDescription: string;
    sellerStatus: string;
  };
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
  };
}

export interface SellerProfile {
  id: string;
  name: string;
  shopName: string;
  shopDescription: string;
  coverImage?: string;
  profileImage?: string;
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
  };
  joinedAt: string;
}

export type SellerStatus = "none" | "applied" | "approved" | "rejected" | "suspended";
