import type { SellerApplicationData, SellerDashboardData, SellerProfile } from "../types";

const API_BASE = "/seller";

export const sellerService = {
  // Apply to become a seller
  async applyForSeller(data: SellerApplicationData) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_BASE}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to submit seller application");
    }

    return response.json();
  },

  // Get seller dashboard
  async getSellerDashboard(): Promise<SellerDashboardData> {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_BASE}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch seller dashboard");
    }

    return response.json();
  },

  // Get public seller profile
  async getSellerProfile(userId: string): Promise<SellerProfile> {
    const response = await fetch(`${API_BASE}/profile/${userId}`);

    if (!response.ok) {
      throw new Error("Seller not found");
    }

    return response.json();
  },

  // Admin: Get all seller applications
  async getAllSellerApplications() {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_BASE}/admin/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch seller applications");
    }

    return response.json();
  },

  // Admin: Approve seller application
  async approveSeller(userId: string) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const response = await fetch(`${API_BASE}/admin/approve/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to approve seller");
    }

    return response.json();
  },

  // Admin: Reject seller application
  async rejectSeller(userId: string, rejectionReason: string) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_BASE}/admin/reject/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rejectionReason }),
    });

    if (!response.ok) {
      throw new Error("Failed to reject seller");
    }

    return response.json();
  },
};
