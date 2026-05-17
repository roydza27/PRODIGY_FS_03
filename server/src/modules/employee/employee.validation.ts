import { z } from "zod";

export const employmentStatusEnum = z.enum([
  "active",
  "inactive",
  "on_leave",
  "resigned",
  "terminated",
]);

export const createEmployeeSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters").max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Phone number must be 10 to 15 digits")
    .optional(),

  jobTitle: z
    .string()
    .trim()
    .min(2)
    .max(100),

  department: z
    .string()
    .trim(
    ).min(2)
    .max(100),

  salary: z.coerce
    .number()
    .min(0)
    .optional(),

  employmentStatus: employmentStatusEnum.optional(),

  dateOfJoining: z.coerce
    .date(),

  address: z
    .string()
    .trim()
    .max(250)
    .optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();