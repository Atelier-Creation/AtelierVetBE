import { z } from "zod";

// ✅ Create Doctor Schema
export const createDoctorSchema = z.object({
  doctor_name: z
    .string({ required_error: "Doctor name is required" })
    .min(2, "Doctor name must be at least 2 characters")
    .max(100, "Doctor name cannot exceed 100 characters"),

  doctor_email: z
    .string({ required_error: "Doctor email is required" })
    .email("Invalid email format")
    .max(100, "Doctor email cannot exceed 100 characters"),

  doctor_phone: z
    .string()
    .optional(),

  staff_profile_id: z
    .string({ required_error: "Staff profile ID is required" })
    .uuid("Invalid staff profile ID format")
    .optional(), // optional because it can be created dynamically in service

  specialties: z
    .array(z.string())
    .nonempty("At least one specialty is required"),

  consultation_fee: z
    .number({ required_error: "Consultation fee is required" })
    .nonnegative("Consultation fee must be non-negative"),

  available_online: z.boolean().optional().default(false),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Doctor Schema
export const updateDoctorSchema = z.object({
  doctor_name: z.string().min(2).max(100).optional(),
  doctor_email: z.string().email().max(100).optional(),
  doctor_phone: z.string().max(15).optional(),
  staff_profile_id: z.string().uuid().optional(),
  specialties: z.array(z.string()).optional(),
  consultation_fee: z.number().nonnegative().optional(),
  available_online: z.boolean().optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
