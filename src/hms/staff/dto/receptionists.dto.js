import { z } from "zod";

// ✅ Create Receptionist Schema
export const createReceptionistSchema = z.object({
  receptionist_name: z
    .string({ required_error: "Receptionist name is required" })
    .min(2, "Receptionist name must be at least 2 characters")
    .max(100, "Receptionist name cannot exceed 100 characters"),

  receptionist_email: z
    .string({ required_error: "Receptionist email is required" })
    .email("Invalid email format")
    .max(100, "Receptionist email cannot exceed 100 characters"),

  receptionist_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .optional(),

  staff_profile_id: z
    .string()
    .uuid("Invalid staff profile ID format")
    .optional(), // Auto-created in service if not provided

  counter_no: z
    .string({ required_error: "Counter number is required" })
    .min(1, "Counter number must not be empty")
    .max(100, "Counter number cannot exceed 100 characters"),

  shift: z
    .string({ required_error: "Shift is required" })
    .min(1, "Shift must not be empty")
    .max(100, "Shift cannot exceed 100 characters"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Receptionist Schema
export const updateReceptionistSchema = z.object({
  receptionist_name: z.string().min(2).max(100).optional(),
  receptionist_email: z.string().email().max(100).optional(),
  receptionist_phone: z.string().min(10).max(15).optional(),
  staff_profile_id: z.string().uuid().optional(),
  counter_no: z.string().max(100).optional(),
  shift: z.string().max(100).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
