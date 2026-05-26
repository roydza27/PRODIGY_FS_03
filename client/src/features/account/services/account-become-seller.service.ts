import { isAxiosError } from "axios";
import api from "@/services/api";
import type {
  SellerApplication,
  SellerApplicationFormData,
  SellerApplicationResponse,
  SellerApplicationStatusResponse,
} from "../types/account-become-seller.types";

const API_BASE = "/seller";

function isNoApplicationError(message?: string) {
  if (!message) return false;

  const normalized = message.toLowerCase();
  return (
    normalized.includes("has not applied to become a seller") ||
    normalized.includes("application not found")
  );
}

export const accountBecomeSellerService = {
  async getApplicationStatus(): Promise<SellerApplication | null> {
    try {
      const response = await api.get<SellerApplicationStatusResponse>(
        `${API_BASE}/status`
      );

      return response.data.data ?? null;
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message as string | undefined;

        if (error.response?.status === 400 && isNoApplicationError(message)) {
          return null;
        }

        throw new Error(message || "Failed to fetch seller application status");
      }

      throw error instanceof Error
        ? error
        : new Error("Failed to fetch seller application status");
    }
  },

  async applyForSeller(
    data: SellerApplicationFormData
  ): Promise<SellerApplicationResponse> {
    try {
      const response = await api.post<SellerApplicationResponse>(
        `${API_BASE}/apply`,
        data
      );

      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message as string | undefined;
        throw new Error(message || "Failed to submit seller application");
      }

      throw error instanceof Error
        ? error
        : new Error("Failed to submit seller application");
    }
  },
};