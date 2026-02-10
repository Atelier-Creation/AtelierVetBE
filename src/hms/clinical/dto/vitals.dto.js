import { z } from "zod";

// ✅ Create Vitals Schema
export const createVitalsSchema = z.object({
  encounter_id: z
    .string({ required_error: "Encounter ID is required" })
    .uuid("Invalid UUID format"),

  patient_id: z
    .string()
    .uuid("Invalid UUID format")
    .optional(), // optional, auto-filled from encounter

  measured_at: z
    .string()
    .optional(), // optional, defaults to now

  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  temperature: z
    .number({ required_error: "Temperature is required" })
    .positive(),
  pulse: z.number().positive().optional(),
  blood_pressure: z.string().max(50).optional(),
  respiratory_rate: z.number().positive().optional(),
  spo2: z.number().positive().optional(),
  notes: z.string().optional(),

  recorded_by: z.string().uuid().optional(),
  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Vitals Schema
export const updateVitalsSchema = z.object({
  encounter_id: z.string().uuid().optional(),
  patient_id: z.string().uuid().optional(),
  measured_at: z.string().optional(),

  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  temperature: z.number().positive().optional(),
  pulse: z.number().positive().optional(),
  blood_pressure: z.string().max(50).optional(),
  respiratory_rate: z.number().positive().optional(),
  spo2: z.number().positive().optional(),
  notes: z.string().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
