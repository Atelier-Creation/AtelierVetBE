import { z } from "zod";

// Common ENUM values
const statusEnum = ["Pending", "Confirmed", "Cancelled", "Completed"];
const visitTypeEnum = ["OPD", "teleconsult", "emergency"];
const sourceEnum = ["Online", "phone", "Offline"];

// ✅ Create Appointment Schema
export const createAppointmentSchema = z.object({
  client_id: z
    .string({ required_error: "Client ID is required" })
    .uuid("Invalid UUID format"),

  pet_id: z
    .string()
    .uuid("Invalid UUID format")
    .optional(),

  doctor_id: z
    .string({ required_error: "Doctor ID is required" })
    .uuid("Invalid UUID format"),

  scheduled_at: z
    .string({ required_error: "Scheduled date is required" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),

  scheduled_time: z
    .string({ required_error: "Scheduled time is required" })
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "Invalid time format (HH:MM:SS)"),

  visit_type: z.enum(visitTypeEnum, {
    required_error: "Visit type is required",
  }),

  status: z
    .enum(statusEnum)
    .optional()
    .default("Pending"),

  reason: z
    .string()
    .max(255, "Reason cannot exceed 255 characters")
    .optional(),

  notes: z
    .string()
    .max(255, "Notes cannot exceed 255 characters")
    .optional(),

  source: z
    .enum(sourceEnum)
    .optional(),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Appointment Schema
export const updateAppointmentSchema = z.object({
  scheduled_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .optional(),

  scheduled_time: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "Invalid time format (HH:MM:SS)")
    .optional(),

  visit_type: z.enum(visitTypeEnum).optional(),
  status: z.enum(statusEnum).optional(),
  reason: z.string().max(255).optional(),
  notes: z.string().max(255).optional(),
  source: z.enum(sourceEnum).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
