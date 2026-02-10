import { z } from "zod";

// ✅ Create Pharmacist Schema
export const createPharmacistSchema = z.object({
  pharmacist_name: z
    .string({ required_error: "Pharmacist name is required" })
    .min(2, "Pharmacist name must be at least 2 characters")
    .max(100, "Pharmacist name cannot exceed 100 characters"),

  pharmacist_email: z
    .string({ required_error: "Pharmacist email is required" })
    .email("Invalid email format")
    .max(100, "Pharmacist email cannot exceed 100 characters"),

  pharmacist_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .optional(),

  staff_profile_id: z
    .string()
    .uuid("Invalid staff profile ID format")
    .optional(), // Optional because it can be created dynamically in service

  license_no: z
    .string({ required_error: "License number is required" })
    .min(3, "License number must be at least 3 characters")
    .max(100, "License number cannot exceed 100 characters"),

  store_location: z
    .string()
    .max(100, "Store location cannot exceed 100 characters")
    .optional(),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Pharmacist Schema
export const updatePharmacistSchema = z.object({
  pharmacist_name: z.string().min(2).max(100).optional(),
  pharmacist_email: z.string().email().max(100).optional(),
  pharmacist_phone: z.string().min(10).max(15).optional(),
  staff_profile_id: z.string().uuid().optional(),
  license_no: z.string().min(3).max(100).optional(),
  store_location: z.string().max(100).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
