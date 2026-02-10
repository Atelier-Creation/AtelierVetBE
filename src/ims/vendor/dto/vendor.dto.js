// dto/vendor.dto.js
import { z } from "zod";

// ✅ Schema for creating a vendor
export const createVendorSchema = z.object({
  name: z
    .string()
    .min(1, "Vendor name is required")
    .max(100, "Vendor name cannot exceed 100 characters"),

  contact_person: z
    .string()
    .max(100, "Contact person cannot exceed 100 characters")
    .optional(),

  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters")
    .optional(),

  phone: z
    .string()
    .regex(/^[0-9+\-() ]*$/, "Invalid phone number format")
    .max(15, "Phone number cannot exceed 15 characters")
    .optional(),

  address: z
    .string()
    .max(255, "Address cannot exceed 255 characters")
    .optional(),

  gst_number: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i,
      "Invalid GST number format"
    )
    .length(15, "GST number must be exactly 15 characters")
    .optional(),

  status: z.enum(["active", "inactive"]).optional().default("active"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid("created_by must be a valid UUID").optional(),
  updated_by: z.string().uuid("updated_by must be a valid UUID").optional(),
  deleted_by: z.string().uuid("deleted_by must be a valid UUID").optional(),
  
  created_by_name: z.string().optional(),
  updated_by_name: z.string().optional(),
  deleted_by_name: z.string().optional(),

  created_by_email: z.string().email("Invalid created_by_email").optional(),
  updated_by_email: z.string().email("Invalid updated_by_email").optional(),
  deleted_by_email: z.string().email("Invalid deleted_by_email").optional(),
});

// ✅ Schema for updating a vendor (all fields optional)
export const updateVendorSchema = createVendorSchema.partial();
