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
  }),
});