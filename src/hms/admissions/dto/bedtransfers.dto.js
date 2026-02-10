// bedtransfers.dto.js
import { z } from "zod";

// ✅ Create Bed Transfer Schema
export const createBedTransferSchema = z.object({
  admission_id: z
    .string({ required_error: "Admission ID is required" })
    .uuid("Invalid Admission ID format"),

  from_bed_id: z
    .string({ required_error: "From Bed ID is required" })
    .uuid("Invalid From Bed ID format"),

  to_bed_id: z
    .string({ required_error: "To Bed ID is required" })
    .uuid("Invalid To Bed ID format"),

  transferred_at: z
    .string()
    .datetime({ message: "Invalid datetime format (use ISO format)" })
    .optional(),

  reason: z
    .string({ required_error: "Reason is required" })
    .min(3, "Reason must have at least 3 characters")
    .max(2000, "Reason cannot exceed 2000 characters"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Bed Transfer Schema
export const updateBedTransferSchema = z.object({
  admission_id: z.string().uuid("Invalid Admission ID format").optional(),
  from_bed_id: z.string().uuid("Invalid From Bed ID format").optional(),
  to_bed_id: z.string().uuid("Invalid To Bed ID format").optional(),
  transferred_at: z.string().datetime().optional(),
  reason: z.string().min(3).max(2000).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
