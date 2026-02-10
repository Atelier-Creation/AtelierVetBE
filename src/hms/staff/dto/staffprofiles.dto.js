import { z } from "zod";

// ✅ Create Staff Profile Schema
export const createStaffProfileSchema = z.object({
  user_id: z
    .string({
      
    })
    .uuid("Invalid user ID format").optional(),

  first_name: z
    .string({
      required_error: "First name is required",
    })
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  last_name: z
    .string({
      required_error: "Last name is required",
    })
    .min(1, "Last name must be at least 1 character")
    .max(50, "Last name cannot exceed 50 characters"),

  department_id: z
    .string({
      required_error: "Department ID is required",
    })
    .uuid("Invalid department ID format"),

  designation_id: z
    .string({
      required_error: "Designation ID is required",
    })
    .uuid("Invalid designation ID format"),

  employee_code: z
    .string({
      
    })
    .min(2, "Employee code must be at least 2 characters")
    .max(10, "Employee code cannot exceed 10 characters").optional(),

  date_of_joining: z
    .string({
      required_error: "Date of joining is required",
    })
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),

  qualification: z
    .string({
      required_error: "Qualification is required",
    })
    .max(100, "Qualification cannot exceed 100 characters"),

  gender: z
    .enum(["Male", "Female", "Other"], {
      required_error: "Gender is required",
    }),

  dob: z
    .string({
      required_error: "Date of birth is required",
    })
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),

  address: z
    .string({
      required_error: "Address is required",
    })
    .max(255, "Address cannot exceed 255 characters"),

  emergency_contact: z
    .object({
      name: z.string().min(2, "Contact name is required"),
      relationship: z.string().min(2, "Relationship is required"),
      phone: z.string().min(10, "Phone number must be valid"),
    })
    .required({ name: true, relationship: true, phone: true }),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Staff Profile Schema
export const updateStaffProfileSchema = z.object({
  user_id: z.string().uuid().optional(),

  first_name: z.string().min(2).max(50).optional(),
  last_name: z.string().min(1).max(50).optional(),

  department_id: z.string().uuid().optional(),
  designation_id: z.string().uuid().optional(),

  employee_code: z.string().min(2).max(10).optional(),

  date_of_joining: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .optional(),

  qualification: z.string().max(100).optional(),

  gender: z.enum(["Male", "Female", "Other"]).optional(),

  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .optional(),

  address: z.string().max(255).optional(),

  emergency_contact: z
    .object({
      name: z.string().optional(),
      relationship: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),

  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
