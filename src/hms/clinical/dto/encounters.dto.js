import { z } from "zod";

// ✅ Create Encounter Schema
export const createEncounterSchema = z.object({
  appointment_id: z.string().uuid().optional(), // optional — can auto-fill doctor & client if given

  client_id: z
    .string({ required_error: "Client ID is required" })
    .uuid("Invalid UUID format")
    .optional(), // optional if appointment_id is provided

  doctor_id: z
    .string({ required_error: "Doctor ID is required" })
    .uuid("Invalid UUID format")
    .optional(), // optional if appointment_id is provided

  encounter_date: z
    .string({ required_error: "Encounter date is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),

  chief_complaint: z
    .string({ required_error: "Chief complaint is required" })
    .min(3, "Chief complaint must be at least 3 characters")
    .max(255, "Chief complaint cannot exceed 255 characters"),

  history: z
    .string({ required_error: "History is required" })
    .min(3, "History must be at least 3 characters"),

  examination: z
    .string({ required_error: "Examination details are required" })
    .min(3, "Examination must be at least 3 characters"),

  plan: z
    .string({ required_error: "Plan is required" })
    .min(3, "Plan must be at least 3 characters"),

  notes: z.string().optional(),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Encounter Schema
export const updateEncounterSchema = z.object({
  appointment_id: z.string().uuid().optional(),
  client_id: z.string().uuid().optional(),
  doctor_id: z.string().uuid().optional(),

  encounter_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),

  chief_complaint: z.string().min(3).max(255).optional(),
  history: z.string().min(3).optional(),
  examination: z.string().min(3).optional(),
  plan: z.string().min(3).optional(),
  notes: z.string().optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
