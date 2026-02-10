import { z } from "zod";

// ✅ Order Item Schema
const orderItemSchema = z.object({
  product_id: z.string().uuid("Product ID must be a valid UUID"),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(1, "Quantity must be at least 1"),
  unit_price: z
    .number({ invalid_type_error: "Unit price must be a number" })
    .min(0, "Unit price cannot be negative")
    .default(0),
  total_price: z
    .number({ invalid_type_error: "Total price must be a number" })
    .min(0, "Total price cannot be negative")
    .default(0),
  tax_amount: z
    .number({ invalid_type_error: "Tax amount must be a number" })
    .min(0, "Tax amount cannot be negative")
    .default(0),
  status: z.enum(["pending", "completed", "cancelled", "approved"]).optional().default("pending"),
});

// ✅ Order Schema
export const createOrderSchema = z.object({
  po_no: z
    .string()
    .min(1, "PO number is required")
    .max(50, "PO number cannot exceed 50 characters").optional(),
  vendor_id: z.string().uuid("Vendor ID must be a valid UUID"),
  order_date: z.string().datetime("Order date must be a valid datetime").optional(),
  total_amount: z
    .number({ invalid_type_error: "Total amount must be a number" })
    .min(0, "Total amount cannot be negative").optional(),
  total_quantity: z
    .number({ invalid_type_error: "Total quantity must be a number" })
    .min(0, "Total quantity cannot be negative").optional(),
  tax_amount: z
    .number({ invalid_type_error: "Tax amount must be a number" })
    .min(0, "Tax amount cannot be negative")
    .optional()
    .default(0),
  status: z.enum(["pending", "completed", "cancelled", "approved"]).optional().default("pending"),
  is_active: z.boolean().optional().default(true),

  // ✅ Array of order items
  items: z.array(orderItemSchema).min(1, "At least one order item is required"),
});

// ✅ For update (all fields optional)
export const updateOrderSchema = createOrderSchema.partial();
