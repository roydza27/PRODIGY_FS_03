import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    slug: z.string().min(2).optional(),
    description: z.string().min(10),
    price: z.number().nonnegative(),
    compareAtPrice: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative(),
    category: z.enum([
      "electronics",
      "fashion",
      "home",
      "groceries",
      "beauty",
      "sports",
      "toys",
      "books",
      "other",
    ]),
    images: z.array(z.string().url()).min(1),
    isFeatured: z.boolean().optional(),
    status: z.enum(["draft", "active", "archived"]).optional(),
    sellerId: z.string().optional(), // Can be provided by admin, auto-set for sellers
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    price: z.number().nonnegative().optional(),
    compareAtPrice: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative().optional(),
    category: z
      .enum([
        "electronics",
        "fashion",
        "home",
        "groceries",
        "beauty",
        "sports",
        "toys",
        "books",
        "other",
      ])
      .optional(),
    images: z.array(z.string().url()).min(1).optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(["draft", "active", "archived"]).optional(),
    sellerId: z.string().optional(), // Admin only
  }),
});

// Validation schema for seller creating their own products (no sellerId manipulation allowed)
export const createSellerProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    slug: z.string().min(2).optional(),
    description: z.string().min(10),
    price: z.number().nonnegative(),
    compareAtPrice: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative(),
    category: z.enum([
      "electronics",
      "fashion",
      "home",
      "groceries",
      "beauty",
      "sports",
      "toys",
      "books",
      "other",
    ]),
    images: z.array(z.string().url()).min(1),
    isFeatured: z.boolean().optional(),
    status: z.enum(["draft", "active", "archived"]).optional(),
    // NOTE: sellerId is explicitly NOT allowed in seller product creation - it's auto-assigned
  }),
});

// Validation schema for seller updating their own products
export const updateSellerProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    price: z.number().nonnegative().optional(),
    compareAtPrice: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative().optional(),
    category: z
      .enum([
        "electronics",
        "fashion",
        "home",
        "groceries",
        "beauty",
        "sports",
        "toys",
        "books",
        "other",
      ])
      .optional(),
    images: z.array(z.string().url()).min(1).optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(["draft", "active", "archived"]).optional(),
    // NOTE: sellerId is explicitly NOT allowed in seller product updates
  }),
});