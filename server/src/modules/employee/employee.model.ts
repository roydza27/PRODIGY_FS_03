import mongoose, { Schema } from "mongoose";
import { IEmployee } from "./employee.types";

const employeeSchema = new Schema<IEmployee>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    salary: {
      type: Number,
      min: 0,
    },
    employmentStatus: {
      type: String,
      enum: ["active", "inactive", "on_leave", "resigned", "terminated"],
      default: "active",
    },
    dateOfJoining: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 250,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);