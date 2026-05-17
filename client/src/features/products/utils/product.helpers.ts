import type { Product } from "../types/product.types";

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export function getProductImage(product: Product) {
  return product.images?.[0] || "";
}

export const getEffectivePrice = (product: Product) =>
  product.price;

export const getDiscountPercentage = (product: Product) => {
  if (!product.compareAtPrice) return 0;

  return Math.round(
    ((product.compareAtPrice - product.price) /
      product.compareAtPrice) *
      100
  );
};