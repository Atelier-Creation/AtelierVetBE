// dto/billing.dto.js
import { z } from "zod";

const billingItemSchema = z.object({
  product_id: z.string().uuid("Product ID must be a valid UUID"),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(1, "Quantity must be at least 1"),
  unit_price: z
    .number({ invalid_type_error: "Unit price must be a number" })
    .min(0, "Unit price cannot be negative")
    .default(0),
  unit: z.string().max(20, "Unit cannot exceed 20 characters").optional(),
  total_price: z
    .number({ invalid_type_error: "Total price must be a number" })
    .min(0, "Total price cannot be negative")
    .default(0),
  discount: z
    .number({ invalid_type_error: "Discount must be a number" })
    .min(0, "Discount cannot be negative")
    .default(0),
  tax: z
    .number({ invalid_type_error: "Tax must be a number" })
    .min(0, "Tax cannot be negative")
    .default(0),
});

// Billing Schema
export const createBillingSchema = z.object({
  bill_no: z
    .string()
    .min(1, "Bill number is required")
    .max(50, "Bill number cannot exceed 50 characters"),
  type: z
    .enum(["Casier Billing", "Customer Billing", "other"])
    .default("Casier Billing"),
    
  customer_name: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Customer name cannot exceed 100 characters"),
  customer_phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Customer phone must be 10 digits")
    .optional(),
  billing_date: z
    .string()
    .datetime("Billing date must be a valid datetime"),
  counter_no: z
    .enum(['Counter 1','Counter 2','Counter 3','Counter 4','Counter 5'])
    .optional(),
  tax_amount: z
    .number({ invalid_type_error: "Tax amount must be a number" })
    .min(0, "Tax amount cannot be negative"),
  discount_amount: z
    .number({ invalid_type_error: "Discount amount must be a number" })
    .min(0, "Discount amount cannot be negative"),
  total_amount: z
    .number({ invalid_type_error: "Total amount must be a number" })
    .min(0, "Total amount cannot be negative"),
  payment_method: z
    .enum(['cash','credit_card','debit_card','upi','net_banking','wallet'])
    .default("cash"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  total_quantity: z
    .number({ invalid_type_error: "Total quantity must be a number" })
    .min(0, "Total quantity cannot be negative"),
  payment_status: z
    .enum(["pending", "paid", "partial", "cancelled"])
    .default("pending"),
  status: z
    .enum(["prescriptions","pending", "paid", "partially_paid", "cancelled"])
    .default("prescriptions"),
  payment_method: z
    .enum(["cash", "card", "upi", "netbanking"])
    .optional(),
  is_active: z.boolean().optional().default(true),
  
  billing_items: z
    .array(billingItemSchema)
    .min(1, "At least one billing item is required"),
});

export const updateBillingSchema = createBillingSchema.partial();
