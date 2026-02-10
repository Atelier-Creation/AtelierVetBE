import { z } from "zod";

// ✅ Define allowed status and priority enums
const statusEnum = ["pending", "completed", "cancelled"];
const priorityEnum = ["normal", "urgent"];

// ✅ Schema for creating a Radiology Order
export const createRadiologyOrderSchema = z.object({
  client_id: z
    .string({ required_error: "Client ID is required" })
    .uuid("Invalid UUID format").optional(),

  encounter_id: z
    .string({ required_error: "Encounter ID is required" })
    .uuid("Invalid UUID format"),

  order_no: z
    .string()
    .min(3, "Order number must be at least 3 characters")
    .max(50, "Order number cannot exceed 50 characters")
    .optional(),

  test_name: z
    .string({ required_error: "Test name is required" })
    .min(2, "Test name must be at least 2 characters")
    .max(50, "Test name cannot exceed 50 characters"),

  test_date: z
    .string({  })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }).optional(),

  ordered_by: z
    .string({ })
    .uuid("Invalid UUID format").optional(),

  status: z.enum(statusEnum, {
    required_error: "Status is required",
  }).default("pending"),

  report_file_url: z
    .string()
    .url("Invalid report file URL format")
    .optional(),

  priority: z.enum(priorityEnum, {
    required_error: "Priority is required",
  }).default("normal"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Schema for updating a Radiology Order
export const updateRadiologyOrderSchema = z.object({
  test_name: z.string().min(2).max(50).optional(),
  test_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .optional(),
  ordered_by: z.string().uuid().optional(),
  status: z.enum(statusEnum).optional(),
  report_file_url: z.string().url("Invalid report file URL").optional(),
  priority: z.enum(priorityEnum).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});

// ✅ Schema for marking a radiology result as completed (uploading report)
export const markRadiologyResultSchema = z.object({
  report_file_url: z
    .string({ required_error: "Report file URL is required" })
    .url("Invalid URL format"),

  status: z
    .enum(["completed"], { required_error: "Status must be 'completed'" })
    .default("completed"),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
