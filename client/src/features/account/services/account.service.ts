import api from "@/services/api";
import type { SellerApplicationFormData, SellerApplication, SellerApplicationResponse } from "@/features/seller/types/seller.types";

const API_BASE = "/seller";

export const accountService = {
  async applyForSeller(data: SellerApplicationFormData) {
    const response = await api.post<SellerApplicationResponse>(`${API_BASE}/apply`, data);
    return response.data;
  },

  async getSellerApplicationStatus() {
    const response = await api.get<{ success: boolean; data: SellerApplication }>(`${API_BASE}/status`);
    return response.data.data;
  },
};