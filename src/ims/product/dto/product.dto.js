// dto/product.dto.js
import { z } from "zod";

//  Schema for creating a product
export const createProductSchema = z.object({
  product_name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name cannot exceed 100 characters"),
  product_code: z
    .string()
    .min(1, "Product code is required")
    .max(50, "Product code cannot exceed 50 characters").optional(),
  category_id: z.string().uuid("Category ID must be a valid UUID").optional(),
  sub_category_id: z.string().uuid("Subcategory ID must be a valid UUID").optional(),
  brand: z.string().max(50, "Brand cannot exceed 50 characters").optional(),
  unit: z.string().max(20, "Unit cannot exceed 20 characters").optional(),
  purchase_price: z
    .number({ invalid_type_error: "Purchase price must be a number" })
    .min(0, "Purchase price cannot be negative")
    .optional()
    .default(0),
  selling_price: z
    .number({ invalid_type_error: "Selling price must be a number" })
    .min(0, "Selling price cannot be negative")
    .optional()
    .default(0),
  min_quantity: z
    .number({ invalid_type_error: "Minimum quantity must be a number" })
    .min(0, "Minimum quantity cannot be negative")
    .optional()
    .default(1),
  max_quantity: z
    .number({ invalid_type_error: "Maximum quantity must be a number" })
    .min(0, "Maximum quantity cannot be negative")
    .optional()
    .default(0),
  tax_percentage: z
    .number({ invalid_type_error: "Tax percentage must be a number" })
    .min(0, "Tax percentage cannot be negative")
    .max(100, "Tax percentage cannot exceed 100")
    .optional()
    .default(0),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  is_active: z.boolean().optional().default(true),
});

// ✅ Schema for updating a product (all fields optional)
export const updateProductSchema = createProductSchema.partial();
