export interface WishlistResponse {
  success: boolean;
  message?: string;
  data: {
    userId: string;
    wishlist: unknown[];
  };
}