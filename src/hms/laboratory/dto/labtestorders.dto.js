import { z } from "zod";

const statusEnum = ["pending", "completed", "collected", "processed"];
const priorityEnum = ["normal", "urgent"];

export const labTestOrderItemSchema = z.object({
  lab_test_id: z
    .string({ required_error: "Lab Test ID is required" })
    .uuid("Invalid UUID format"),

  sample_type: z
    .string({ required_error: "Sample type is required" })
    .min(2, "Sample type must be at least 2 characters")
    .max(50, "Sample type cannot exceed 50 characters"),

  collected_at: z
    .string()
    .datetime({ message: "Invalid datetime format for collected_at" })
    .optional(),

  result_value: z.string().max(50).optional(),
  result_file_url: z.string().url("Invalid URL format").optional(),

  resulted_by: z.string().uuid().optional(),
  resulted_at: z
    .string()
    .datetime({ message: "Invalid datetime format for resulted_at" })
    .optional(),
});

// ✅ Create Lab Test Order Schema
export const createLabTestOrderSchema = z.object({
  client_id: z
    .string({ required_error: "Client ID is required" })
    .uuid("Invalid UUID format").optional(),

  encounter_id: z
    .string({ required_error: "Encounter ID is required" })
    .uuid("Invalid UUID format"),

  order_no: z
    .string({ required_error: "Order number is required" })
    .min(3, "Order number must be at least 3 characters")
    .max(50, "Order number cannot exceed 50 characters").optional(),

  order_date: z
    .string({ required_error: "Order date is required" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }).default(new Date().toISOString()).optional(),

  status: z.enum(statusEnum, {
    required_error: "Status is required",
  }),

  priority: z.enum(priorityEnum, {
    required_error: "Priority is required",
  }),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),

  // ✅ Array of lab test items
  items: z
    .array(labTestOrderItemSchema, { required_error: "At least one test item is required" })
    .min(1, "At least one lab test item is required"),
});

// ✅ Update Lab Test Order Schema
export const updateLabTestOrderSchema = z.object({
  status: z.enum(statusEnum).optional(),
  priority: z.enum(priorityEnum).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),

  // Optional update to items
  items: z.array(labTestOrderItemSchema).optional(),
});
