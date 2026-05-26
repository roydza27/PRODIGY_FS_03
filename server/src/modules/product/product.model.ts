import { Schema, model, type InferSchemaType } from "mongoose";

const specificationSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        "electronics",
        "fashion",
        "home",
        "groceries",
        "beauty",
        "sports",
        "toys",
        "books",
        "other",
      ],
      index: true,
    },
    images: [{ type: String, required: true }],
    isFeatured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
      index: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    specifications: { type: [specificationSchema], default: [] },
    faqs: { type: [faqSchema], default: [] },
    reviews: { type: [reviewSchema], default: [] },
  },
  { timestamps: true }
);

export type ProductDocument = InferSchemaType<typeof productSchema>;
export const Product = model("Product", productSchema);