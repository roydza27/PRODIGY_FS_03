import { z } from "zod";

const productCategoryEnum = z.enum([
  "electronics",
  "fashion",
  "home",
  "groceries",
  "beauty",
  "sports",
  "toys",
  "books",
  "other",
]);

const productStatusEnum = z.enum(["draft", "active", "archived"]);

const specificationSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const baseProductFields = {
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().min(10),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative(),
  category: productCategoryEnum,
  images: z.array(z.string().url()).min(1),
  specifications: z.array(specificationSchema).optional(),
  faqs: z.array(faqSchema).optional(),
  isFeatured: z.boolean().optional(),
  status: productStatusEnum.optional(),
};

const updateProductFields = {
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().nonnegative().optional(),
  compareAtPrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  category: productCategoryEnum.optional(),
  images: z.array(z.string().url()).min(1).optional(),
  specifications: z.array(specificationSchema).optional(),
  faqs: z.array(faqSchema).optional(),
  isFeatured: z.boolean().optional(),
  status: productStatusEnum.optional(),
};

export const createProductSchema = z.object({
  body: z.object({
    ...baseProductFields,
    sellerId: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    ...updateProductFields,
    sellerId: z.string().optional(),
  }),
});

// Seller creating their own products
export const createSellerProductSchema = z.object({
  body: z.object({
    ...baseProductFields,
    sellerId: z.string().optional(),
  }),
});

// Seller updating their own products
export const updateSellerProductSchema = z.object({
  body: z.object({
    ...updateProductFields,
  }),
});

export const createProductReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(3).max(1000),
  }),
});