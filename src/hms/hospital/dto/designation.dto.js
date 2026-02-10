import { z } from "zod";

// ✅ Create Designation Schema
export const createDesignationSchema = z.object({
  title: z
    .string({
      required_error: "Designation title is required",
    })
    .min(2, "Designation title must be at least 2 characters")
    .max(50, "Designation title cannot exceed 50 characters"),

  description: z
    .string({
      required_error: "Designation description is required",
    })
    .min(2, "Designation description must be at least 2 characters")
    .max(250, "Designation description cannot exceed 250 characters"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Designation Schema
export const updateDesignationSchema = z.object({
  title: z
    .string()
    .min(2, "Designation title must be at least 2 characters")
    .max(50, "Designation title cannot exceed 50 characters")
    .optional(),

  description: z
    .string()
    .min(2, "Designation description must be at least 2 characters")
    .max(250, "Designation description cannot exceed 250 characters")
    .optional(),

  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
