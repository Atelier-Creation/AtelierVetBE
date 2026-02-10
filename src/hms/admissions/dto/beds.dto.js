import { z } from "zod";

// ✅ Create Bed Schema
export const createBedSchema = z.object({
  room_id: z
    .string({ required_error: "Room ID is required" })
    .uuid("Invalid Room ID format"),

  bed_no: z
    .string({ required_error: "Bed number is required" })
    .min(1, "Bed number must have at least 1 character")
    .max(50, "Bed number cannot exceed 50 characters"),

  is_occupied: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Bed Schema
export const updateBedSchema = z.object({
  room_id: z.string().uuid("Invalid Room ID format").optional(),
  bed_no: z.string().min(1).max(50).optional(),
  is_occupied: z.boolean().optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
