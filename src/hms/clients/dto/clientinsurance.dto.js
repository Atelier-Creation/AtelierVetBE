import { z } from "zod";

// ✅ Create Client Insurance Schema
export const createClientInsuranceSchema = z.object({
  client_id: z
    .string({ required_error: "Client ID is required" })
    .uuid("Invalid UUID format"),

  provider_name: z
    .string({ required_error: "Provider name is required" })
    .min(2, "Provider name must be at least 2 characters")
    .max(100, "Provider name cannot exceed 100 characters"),

  policy_number: z
    .string({ required_error: "Policy number is required" })
    .min(2, "Policy number must be at least 2 characters")
    .max(100, "Policy number cannot exceed 100 characters"),

  coverage_details: z
    .string({ required_error: "Coverage details are required" })
    .min(5, "Coverage details must be at least 5 characters")
    .max(255, "Coverage details cannot exceed 255 characters"),

  valid_from: z
    .string({ required_error: "Valid from date is required" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),

  valid_to: z
    .string({ required_error: "Valid to date is required" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),

  is_primary: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Client Insurance Schema
export const updateClientInsuranceSchema = z.object({
  provider_name: z.string().min(2).max(100).optional(),
  policy_number: z.string().min(2).max(100).optional(),
  coverage_details: z.string().min(5).max(255).optional(),
  valid_from: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .optional(),
  valid_to: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .optional(),
  is_primary: z.boolean().optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
