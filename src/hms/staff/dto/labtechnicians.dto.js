import { z } from "zod";

// ✅ Create Lab Technician Schema
export const createLabTechnicianSchema = z.object({
  labtech_name: z
    .string({ required_error: "Lab Technician name is required" })
    .min(2, "Lab Technician name must be at least 2 characters")
    .max(100, "Lab Technician name cannot exceed 100 characters"),

  labtech_email: z
    .string({ required_error: "Lab Technician email is required" })
    .email("Invalid email format")
    .max(100, "Lab Technician email cannot exceed 100 characters"),

  labtech_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .optional(),

  staff_profile_id: z
    .string()
    .uuid("Invalid staff profile ID format")
    .optional(), // Can be auto-created in service

  certifications: z
    .array(z.string().min(1, "Certification cannot be empty"))
    .optional(),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Lab Technician Schema
export const updateLabTechnicianSchema = z.object({
  labtech_name: z.string().min(2).max(100).optional(),
  labtech_email: z.string().email().max(100).optional(),
  labtech_phone: z.string().min(10).max(15).optional(),
  staff_profile_id: z.string().uuid().optional(),
  certifications: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
