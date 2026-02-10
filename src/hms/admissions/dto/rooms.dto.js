import { z } from "zod";

const roomTypeEnum = ["ICU", "Private", "General"];

// ✅ Create Room Schema
export const createRoomSchema = z.object({
  ward_id: z
    .string({ required_error: "Ward ID is required" })
    .uuid("Invalid Ward ID format"),

  room_no: z
    .string({ required_error: "Room number is required" })
    .min(1, "Room number must have at least 1 character")
    .max(50, "Room number cannot exceed 50 characters"),

  room_type: z.enum(roomTypeEnum, {
    required_error: "Room type is required",
  }),

  capacity: z
    .number({ required_error: "Room capacity is required" })
    .int("Capacity must be an integer")
    .positive("Capacity must be greater than 0"),

  price_per_day: z
    .number({ required_error: "Room price per day is required" })
    .positive("Price per day must be greater than 0"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Room Schema
export const updateRoomSchema = z.object({
  ward_id: z.string().uuid("Invalid Ward ID format").optional(),
  room_no: z.string().min(1).max(50).optional(),
  room_type: z.enum(roomTypeEnum).optional(),
  capacity: z.number().int().positive().optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
