// dto/return.dto.js
import { z } from "zod";

export const returnItemSchema = z.object({
  product_id: z.string().uuid("Product ID must be a valid UUID"),

  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(1, "Quantity must be at least 1"),

  unit_price: z
    .number({ invalid_type_error: "Unit price must be a number" })
    .min(0, "Unit price cannot be negative")
    .optional(),

  tax_amount: z
    .number({ invalid_type_error: "Tax amount must be a number" })
    .min(0, "Tax amount cannot be negative")
    .optional(),

  total_price: z
    .number({ invalid_type_error: "Total price must be a number" })
    .min(0, "Total price cannot be negative")
    .optional(),

  reason: z
    .string()
    .max(255, "Reason cannot exceed 255 characters")
    .optional()
    .nullable(),

  // list of inward item ids (UUIDs) or parent inward ids depending on your usage
  inward_ids: z
    .array(z.string().uuid("Each inward id must be a valid UUID"))
    .optional()
    .default([]),
});

/**
 * Create Return schema
 * - items: array of returnItemSchema (service expects `data.items`)
 *
 * NOTE: vendor_id is OPTIONAL now (nullable + optional).
 */
export const createReturnSchema = z.object({
  return_no: z
    .string()
    .min(1, "Return number is required")
    .max(50, "Return number cannot exceed 50 characters")
    .optional(), // service may auto-generate

  reason: z
    .string()
    .max(255, "Reason cannot exceed 255 characters")
    .optional()
    .nullable(),

  total_amount: z
    .number({ invalid_type_error: "Total amount must be a number" })
    .min(0, "Total amount cannot be negative")
    .optional(),

  total_quantity: z
    .number({ invalid_type_error: "Total quantity must be a number" })
    .min(0, "Total quantity cannot be negative")
    .optional(),

  total_tax: z
    .number({ invalid_type_error: "Total tax must be a number" })
    .min(0, "Total tax cannot be negative")
    .optional(),

  status: z.enum(["pending", "processed", "cancelled"]).optional().default("pending"),

  return_date: z
    .string()
    .datetime("Return date must be a valid datetime")
    .optional(),

  return_type: z.enum(["customer", "partial"]).optional().default("partial"),

  billing_id: z.string().uuid("Billing ID must be a valid UUID").nullable().optional(),

  // <-- CHANGED: vendor_id is now optional & nullable
  vendor_id: z.string().uuid("Vendor ID must be a valid UUID").nullable().optional(),

  is_active: z.boolean().optional().default(true),

  // audit fields (optional)
  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),

  // Items array (service expects `items`) — still required on create
  items: z
    .array(returnItemSchema)
    .min(1, "At least one return item is required"),
});


export const updateReturnSchema = createReturnSchema.partial({
  // make `items` optional on update (partial() already did, but ensure min array not enforced)
  items: true,
});