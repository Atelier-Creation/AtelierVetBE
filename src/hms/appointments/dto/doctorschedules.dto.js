import { z } from "zod";

// ✅ Create Doctor Schedule Schema
export const createDoctorScheduleSchema = z.object({
  doctor_id: z
    .string({ required_error: "Doctor ID is required" })
    .uuid("Invalid UUID format"),

  start_time: z
    .string({ required_error: "Start time is required" })
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "Invalid time format (HH:MM:SS)"),

  end_time: z
    .string({ required_error: "End time is required" })
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "Invalid time format (HH:MM:SS)"),

  weekoffday: z.enum(
    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    { required_error: "Week off day is required" }
  ),

  slot_duration_minutes: z
    .number({ required_error: "Slot duration is required" })
    .min(5, "Minimum slot duration is 5 minutes")
    .max(240, "Maximum slot duration is 240 minutes"),

  location: z
    .string({ required_error: "Location is required" })
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location cannot exceed 100 characters"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Doctor Schedule Schema
export const updateDoctorScheduleSchema = z.object({
  start_time: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "Invalid time format (HH:MM:SS)")
    .optional(),

  end_time: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "Invalid time format (HH:MM:SS)")
    .optional(),

  weekoffday: z
    .enum(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
    .optional(),

  slot_duration_minutes: z
    .number()
    .min(5, "Minimum slot duration is 5 minutes")
    .max(240, "Maximum slot duration is 240 minutes")
    .optional(),

  location: z.string().min(2).max(100).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
