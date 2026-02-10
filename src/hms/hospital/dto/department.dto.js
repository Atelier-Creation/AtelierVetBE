import { z } from "zod";

// ✅ Create Department Schema
export const createDepartmentSchema = z.object({
  name: z
    .string({
      required_error: "Department name is required",
    })
    .min(2, "Department name must be at least 2 characters")
    .max(50, "Department name cannot exceed 50 characters"),

  code: z
    .string({
      required_error: "Department code is required",
    })
    .min(2, "Department code must be at least 2 characters")
    .max(10, "Department code cannot exceed 10 characters"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Department Schema
export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(50, "Department name cannot exceed 50 characters")
    .optional(),

  code: z
    .string()
    .min(2, "Department code must be at least 2 characters")
    .max(10, "Department code cannot exceed 10 characters")
    .optional(),

  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
