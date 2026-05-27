import { Schema, model, models } from "mongoose";

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
      // FIXED: When password is not required (e.g., Google users), Mongoose still tries 
      // to validate minlength on undefined/null values. Adding a custom validator avoids this.
      validate: {
        validator: function (v: string) {
          // Only validate length if a password string is actually being provided
          return !v || v.length >= 6;
        },
        message: "Password must be at least 6 characters long",
      },
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // Perfect! This keeps your null entries from throwing indexing errors
      trim: true,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },

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
        trim: true, // Useful fallback if your platform validates IFSC codes
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