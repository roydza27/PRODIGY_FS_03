import { Schema, model, models, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },

    // Seller workflow tracking
    sellerStatus: {
      type: String,
      enum: ["none", "applied", "approved", "rejected", "suspended"],
      default: "none",
    },

    sellerInfo: {
      shopName: {
        type: String,
        trim: true,
      },

      shopDescription: {
        type: String,
        trim: true,
      },

      businessEmail: {
        type: String,
        trim: true,
        lowercase: true,
      },

      businessPhone: {
        type: String,
        trim: true,
      },

      bankAccountName: {
        type: String,
        trim: true,
      },

      bankAccountNumber: {
        type: String,
        trim: true,
      },

      bankCode: {
        type: String,
        trim: true,
      },

      businessRegistration: {
        type: String,
        trim: true,
      },

      gstNumber: {
        type: String,
        trim: true,
      },

      coverImage: {
        type: String,
      },

      profileImage: {
        type: String,
      },
    },

    sellerAppliedAt: {
      type: Date,
    },

    sellerApprovedAt: {
      type: Date,
    },

    sellerRejectedAt: {
      type: Date,
    },

    sellerRejectionReason: {
      type: String,
    },

    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model("User", userSchema);