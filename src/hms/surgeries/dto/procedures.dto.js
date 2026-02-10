import { z } from "zod";

// ✅ Create Procedure Schema
export const createProcedureSchema = z.object({
  name: z
    .string({
      required_error: "Procedure name is required",
    })
    .min(2, "Procedure name must be at least 2 characters")
    .max(50, "Procedure name cannot exceed 50 characters"),

  procedure_code: z
    .string({
      required_error: "Procedure code is required",
    })
    .min(2, "Procedure code must be at least 2 characters")
    .max(10, "Procedure code cannot exceed 10 characters"),

  description: z
    .string({
      required_error: "Procedure description is required",
    })
    .min(2, "Description must be at least 2 characters")
    .max(250, "Description cannot exceed 250 characters"),

  risk_level: z
    .string({
      required_error: "Risk level is required",
    })
    .max(50, "Risk level cannot exceed 50 characters"),

  base_charge: z
    .number({
      required_error: "Base charge is required",
      invalid_type_error: "Base charge must be a number",
    })
    .min(0, "Base charge cannot be negative"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Procedure Schema
export const updateProcedureSchema = z.object({
  name: z
    .string()
    .min(2, "Procedure name must be at least 2 characters")
    .max(50, "Procedure name cannot exceed 50 characters")
    .optional(),

  procedure_code: z
    .string()
    .min(2, "Procedure code must be at least 2 characters")
    .max(10, "Procedure code cannot exceed 10 characters")
    .optional(),

  description: z
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(250, "Description cannot exceed 250 characters")
    .optional(),

  risk_level: z.string().max(50, "Risk level cannot exceed 50 characters").optional(),

  base_charge: z.number().min(0, "Base charge cannot be negative").optional(),

  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
