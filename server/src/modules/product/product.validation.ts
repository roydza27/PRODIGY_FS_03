import { z } from "zod";

const specificationSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

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
    specifications: z.array(specificationSchema).optional(),
    faqs: z.array(faqSchema).optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(["draft", "active", "archived"]).optional(),
    sellerId: z.string().optional(),
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
    ]).optional(),
    images: z.array(z.string().url()).min(1).optional(),
    specifications: z.array(specificationSchema).optional(),
    faqs: z.array(faqSchema).optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(["draft", "active", "archived"]).optional(),
    sellerId: z.string().optional(),
  }),
});

// Validation schema for seller creating their own products (no sellerId manipulation allowed)
export const createSellerProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    price: z.number().nonnegative().optional(),
    compareAtPrice: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative().optional(),
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
    ]).optional(),
    images: z.array(z.string().url()).min(1).optional(),
    specifications: z.array(specificationSchema).optional(),
    faqs: z.array(faqSchema).optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(["draft", "active", "archived"]).optional(),
    sellerId: z.string().optional(),
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
    ]).optional(),
    images: z.array(z.string().url()).min(1).optional(),
    specifications: z.array(specificationSchema).optional(),
    faqs: z.array(faqSchema).optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(["draft", "active", "archived"]).optional(),
    sellerId: z.string().optional(),
  }),
});