import { z } from "zod";

// Allowed enums
const petTypeEnum = ["Dog", "Cat", "Bird", "Rabbit", "Other"];
const genderEnum = ["Male", "Female"];

/**
 * ✅ Create Pet Schema
 */
export const createPetSchema = z.object({
  client_id: z
    .string({ required_error: "Client ID is required" })
    .uuid("Invalid UUID format"),

  name: z
    .string({ required_error: "Pet name is required" })
    .min(2, "Pet name must be at least 2 characters")
    .max(100, "Pet name cannot exceed 100 characters"),

  pet_type: z
    .enum(petTypeEnum, { required_error: "Pet type is required" }),

  pet_color: z.string().max(50, "Color cannot exceed 50 characters").optional(),

  dob: z.coerce
    .date({ required_error: "Date of birth is required" }),

  age: z
    .number({ required_error: "Age is required" })
    .int("Age must be an integer")
    .min(0, "Age cannot be negative"),

  weight: z
    .number()
    .positive("Weight must be positive")
    .optional(),

  breed: z.string().max(100, "Breed cannot exceed 100 characters").optional(),

  gender: z
    .enum(genderEnum, { required_error: "Gender is required" }),

  is_active: z.boolean().optional().default(true),

  // Audit fields
  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

/**
 * ✅ Update Pet Schema
 */
export const updatePetSchema = z.object({
  name: z.string().min(2).max(100).optional(),

  pet_type: z.enum(petTypeEnum).optional(),

  pet_color: z.string().max(50).optional(),

  dob: z.coerce.date().optional(),

  age: z.number().int().min(0).optional(),

  weight: z.number().positive().optional(),

  breed: z.string().max(100).optional(),

  gender: z.enum(genderEnum).optional(),

  is_active: z.boolean().optional(),

  // Audit fields
  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
