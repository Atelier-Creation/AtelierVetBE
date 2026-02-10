import { z } from "zod";

// ✅ Create Clinical Note Schema
export const createClinicalNoteSchema = z.object({
  encounter_id: z
    .string({ required_error: "Encounter ID is required" })
    .uuid("Invalid UUID format"),

  note_type: z.enum(["progress", "nurse", "doctor", "discharge"], {
    required_error: "Note type is required",
    invalid_type_error:
      "Note type must be one of: progress, nurse, doctor, discharge",
  }),

  note: z
    .string({ required_error: "Note content is required" })
    .min(3, "Note must be at least 3 characters long"),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Clinical Note Schema
export const updateClinicalNoteSchema = z.object({
  note_type: z
    .enum(["progress", "nurse", "doctor", "discharge"])
    .optional(),

  note: z.string().min(3).optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
