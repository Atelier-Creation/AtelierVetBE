import { z } from "zod";

// ✅ Create Accountant Schema
export const createAccountantSchema = z.object({
  accountant_name: z
    .string({ required_error: "Accountant name is required" })
    .min(2, "Accountant name must be at least 2 characters")
    .max(100, "Accountant name cannot exceed 100 characters"),

  accountant_email: z
    .string({ required_error: "Accountant email is required" })
    .email("Invalid email format")
    .max(100, "Accountant email cannot exceed 100 characters"),

  accountant_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .optional(),

  staff_profile_id: z
    .string()
    .uuid("Invalid staff profile ID format")
    .optional(), // Optional because it can be created dynamically in service

  ledger_code: z
    .string()
    .max(100, "Ledger code cannot exceed 100 characters")
    .optional(),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Accountant Schema
export const updateAccountantSchema = z.object({
  accountant_name: z.string().min(2).max(100).optional(),
  accountant_email: z.string().email().max(100).optional(),
  accountant_phone: z.string().min(10).max(15).optional(),
  staff_profile_id: z.string().uuid().optional(),
  ledger_code: z.string().max(100).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
