import { z } from "zod";

// ✅ Create Lab Test Schema
export const createLabTestSchema = z.object({
  name: z
    .string({
      required_error: "Lab test name is required",
    })
    .min(2, "Lab test name must be at least 2 characters")
    .max(50, "Lab test name cannot exceed 50 characters"),

  code: z
    .string({
      required_error: "Lab test code is required",
    })
    .min(2, "Lab test code must be at least 2 characters")
    .max(10, "Lab test code cannot exceed 10 characters"),

  category: z
    .string({
      required_error: "Category is required",
    })
    .max(100, "Category cannot exceed 100 characters"),

  method: z
    .string({
      required_error: "Method is required",
    })
    .max(100, "Method cannot exceed 100 characters"),

  units: z
    .string({
      required_error: "Units are required",
    })
    .max(100, "Units cannot exceed 100 characters"),

  reference_range: z
    .string({
      required_error: "Reference range is required",
    })
    .max(255, "Reference range cannot exceed 255 characters"),

  turnaround_time: z
    .string({
      required_error: "Turnaround time is required",
    })
    .max(100, "Turnaround time cannot exceed 100 characters"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Lab Test Schema
export const updateLabTestSchema = z.object({
  name: z
    .string()
    .min(2, "Lab test name must be at least 2 characters")
    .max(50, "Lab test name cannot exceed 50 characters")
    .optional(),

  code: z
    .string()
    .min(2, "Lab test code must be at least 2 characters")
    .max(10, "Lab test code cannot exceed 10 characters")
    .optional(),

  category: z.string().max(100, "Category cannot exceed 100 characters").optional(),
  method: z.string().max(100, "Method cannot exceed 100 characters").optional(),
  units: z.string().max(100, "Units cannot exceed 100 characters").optional(),
  reference_range: z.string().max(255, "Reference range cannot exceed 255 characters").optional(),
  turnaround_time: z.string().max(100, "Turnaround time cannot exceed 100 characters").optional(),

  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
