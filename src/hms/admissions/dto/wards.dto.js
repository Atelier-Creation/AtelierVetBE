import { z } from "zod";

// ✅ Create Ward Schema
export const createWardSchema = z.object({
  name: z
    .string({
      required_error: "Ward name is required",
    })
    .min(2, "Ward name must be at least 2 characters")
    .max(50, "Ward name cannot exceed 50 characters"),

  description: z
    .string({
      required_error: "Ward description is required",
    })
    .min(2, "Ward description must be at least 2 characters")
    .max(250, "Ward description cannot exceed 250 characters"),

  floor: z
    .string({
      required_error: "Floor is required",
    })
    .min(1, "Floor must be at least 1 character")
    .max(50, "Floor cannot exceed 50 characters"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Ward Schema
export const updateWardSchema = z.object({
  name: z
    .string()
    .min(2, "Ward name must be at least 2 characters")
    .max(50, "Ward name cannot exceed 50 characters")
    .optional(),

  description: z
    .string()
    .min(2, "Ward description must be at least 2 characters")
    .max(250, "Ward description cannot exceed 250 characters")
    .optional(),

  floor: z
    .string()
    .min(1, "Floor must be at least 1 character")
    .max(50, "Floor cannot exceed 50 characters")
    .optional(),

  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
