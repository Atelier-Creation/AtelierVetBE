import { z } from "zod";

// ✅ Create Nurse Schema
export const createNurseSchema = z.object({
  nurse_name: z
    .string({ required_error: "Nurse name is required" })
    .min(2, "Nurse name must be at least 2 characters")
    .max(100, "Nurse name cannot exceed 100 characters"),

  nurse_email: z
    .string({ required_error: "Nurse email is required" })
    .email("Invalid email format")
    .max(100, "Nurse email cannot exceed 100 characters"),

  nurse_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .optional(),

  staff_profile_id: z
    .string()
    .uuid("Invalid staff profile ID format")
    .optional(), // Optional because it can be created dynamically in service

  shift: z
    .string()
    .max(100, "Shift cannot exceed 100 characters")
    .optional(),

  license_no: z
    .string({ required_error: "License number is required" })
    .min(3, "License number must be at least 3 characters")
    .max(100, "License number cannot exceed 100 characters"),

  skills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .nonempty("At least one skill is required"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Nurse Schema
export const updateNurseSchema = z.object({
  nurse_name: z.string().min(2).max(100).optional(),
  nurse_email: z.string().email().max(100).optional(),
  nurse_phone: z.string().min(10).max(15).optional(),
  staff_profile_id: z.string().uuid().optional(),
  shift: z.string().max(100).optional(),
  license_no: z.string().min(3).max(100).optional(),
  skills: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
