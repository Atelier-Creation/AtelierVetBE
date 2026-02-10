import { z } from "zod";

// ✅ Create Patient Contact Schema
export const createPatientContactSchema = z.object({
  patient_id: z.string({ required_error: "Patient ID is required" }).uuid("Invalid UUID format"),
  
  name: z
    .string({ required_error: "Contact name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z.string().email("Invalid email format").max(100).optional(),
  
  phone: z
    .string({ required_error: "Phone number is required" })
    .max(15, "Phone number cannot exceed 15 digits"),

  relationship: z
    .string({ required_error: "Relationship is required" })
    .min(2, "Relationship must be at least 2 characters")
    .max(100, "Relationship cannot exceed 100 characters"),

  address: z.string().max(255).optional(),
  
  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Patient Contact Schema
export const updatePatientContactSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().max(100).optional(),
  phone: z.string().max(15).optional(),
  relationship: z.string().min(2).max(100).optional(),
  address: z.string().max(255).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
