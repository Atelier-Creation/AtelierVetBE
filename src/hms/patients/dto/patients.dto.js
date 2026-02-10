import { z } from "zod";

// ✅ Create Patient Schema
export const createPatientSchema = z.object({
  first_name: z
    .string({ required_error: "First name is required" })
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name cannot exceed 100 characters"),

  last_name: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name must be at least 1 characters")
    .max(100, "Last name cannot exceed 100 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters"),

  phone: z
    .string()
    .max(15, "Phone number cannot exceed 15 digits")
    .optional(),

  gender: z.enum(["Male", "Female"], {
    required_error: "Gender is required",
  }),

  dob: z
    .string({ required_error: "Date of birth is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),

  age: z
    .number({ required_error: "Age is required" })
    .int("Age must be an integer")
    .positive("Age must be greater than 0").optional(),

  address: z
    .string({ required_error: "Address is required" })
    .min(5, "Address must be at least 5 characters long")
    .max(255, "Address cannot exceed 255 characters"),

  blood_group: z.enum(
    ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    { required_error: "Blood group is required" }
  ),

  marital_status: z.enum(["Single", "Married"], {
    required_error: "Marital status is required",
  }),

  notes: z.string().max(255).optional(),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Patient Schema
export const updatePatientSchema = z.object({
  first_name: z.string().min(2).max(100).optional(),
  last_name: z.string().min(2).max(100).optional(),
  email: z.string().email().max(100).optional(),
  phone: z.string().max(15).optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .optional(),
  age: z.number().int().positive().optional(),
  address: z.string().min(5).max(255).optional(),
  blood_group: z
    .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
    .optional(),
  marital_status: z.enum(["Single", "Married"]).optional(),
  notes: z.string().max(255).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
