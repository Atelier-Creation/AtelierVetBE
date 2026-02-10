import { z } from "zod";

// ✅ Create Diagnosis Schema
export const createDiagnosisSchema = z.object({
  encounter_id: z
    .string({ required_error: "Encounter ID is required" })
    .uuid("Invalid UUID format"),

  icd_code: z
    .string({ required_error: "ICD code is required" })
    .min(1, "ICD code cannot be empty")
    .max(50, "ICD code cannot exceed 50 characters"),

  description: z
    .string({ required_error: "Description is required" })
    .min(3, "Description must be at least 3 characters"),

  primary: z
    .boolean()
    .optional()
    .default(false),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Diagnosis Schema
export const updateDiagnosisSchema = z.object({
  encounter_id: z.string().uuid().optional(),
  icd_code: z.string().min(1).max(50).optional(),
  description: z.string().min(3).optional(),
  primary: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
