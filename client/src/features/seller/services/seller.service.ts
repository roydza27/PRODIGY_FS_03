import api from "@/services/api";
import type {
  SellerApplicationFormData,
  SellerApplication,
  SellerApplicationResponse,
  SellerDashboard,
  AdminSellerApplicationItem,
  ApprovalResponse,
} from "../types/seller.types";

const API_BASE = "/seller";

export const sellerService = {
  // User: Apply to become a seller
  async applyForSeller(data: SellerApplicationFormData) {
    const response = await api.post<SellerApplicationResponse>(
      `${API_BASE}/apply`,
      data
    );
    return response.data;
  },

  // User: Get seller application status
  async getApplicationStatus() {
    const response = await api.get<{
      success: boolean;
      data: SellerApplication;
    }>(`${API_BASE}/status`);
    return response.data.data;
  },

  // User: Get seller dashboard
  async getSellerDashboard() {
    const response = await api.get<{
      success: boolean;
      data: SellerDashboard;
    }>(`${API_BASE}/dashboard`);
    return response.data.data;
  },

  // User: Get seller profile (public)
  async getSellerProfile(userId: string) {
    const response = await api.get<{
      success: boolean;
      data: {
        name: string;
        email: string;
        shopName: string;
        shopDescription: string;
        sellerStatus: string;
      };
    }>(`${API_BASE}/profile/${userId}`);
    return response.data.data;
  },

  // Admin: Get all seller applications
  async getAllApplications() {
    const response = await api.get<{
      success: boolean;
      data: AdminSellerApplicationItem[];
    }>(`${API_BASE}/admin/applications`);
    return response.data.data;
  },

  // Admin: Get single application details
  async getApplicationById(userId: string) {
    const response = await api.get<{
      success: boolean;
      data: AdminSellerApplicationItem;
    }>(`${API_BASE}/admin/applications/${userId}`);
    return response.data.data;
  },

  // Admin: Approve seller application
  async approveSeller(userId: string) {
    const response = await api.post<ApprovalResponse>(
      `${API_BASE}/admin/approve/${userId}`,
      {}
    );
    return response.data;
  },

  // Admin: Reject seller application
  async rejectSeller(userId: string, rejectionReason: string) {
    const response = await api.post<ApprovalResponse>(
      `${API_BASE}/admin/reject/${userId}`,
      { rejectionReason }
    );
    return response.data;
  },
  async updateSettings(data: any) {
    const response = await api.patch<{
      success: boolean;
      message: string;
    }>(`${API_BASE}/settings`, data);
    return response.data;
  },
  
};
