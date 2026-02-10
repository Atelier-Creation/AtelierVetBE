import { z } from "zod";

// ✅ Create Admission Schema
export const createAdmissionSchema = z.object({
  patient_id: z
    .string({ required_error: "Patient ID is required" })
    .uuid("Invalid Patient ID format"),

  admission_date: z
    .string()
    .datetime({ message: "Invalid date format (use ISO format)" })
    .optional(),

  admitted_by: z
    .string({ })
    .uuid("Invalid user ID format").optional(),

  reason: z
    .string({ required_error: "Admission reason is required" })
    .min(3, "Reason must be at least 3 characters"),

  ward_id: z
    .string({  })
    .uuid("Invalid Ward ID format").optional(),

  room_id: z
    .string({})
    .uuid("Invalid Room ID format").optional(),

  bed_id: z
    .string({ required_error: "Bed ID is required" })
    .uuid("Invalid Bed ID format"),

  status: z
    .enum(["admitted", "discharged", "transferred", "test"])
    .optional()
    .default("admitted"),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Admission Schema
export const updateAdmissionSchema = z.object({
  admission_date: z.string().datetime().optional(),
  reason: z.string().min(3).optional(),
  ward_id: z.string().uuid("Invalid Ward ID format").optional(),
  room_id: z.string().uuid("Invalid Room ID format").optional(),
  bed_id: z.string().uuid("Invalid Bed ID format").optional(),
  discharge_datetime: z.string().datetime().optional(),
  discharge_by: z.string().uuid().optional(),
  discharge_reason: z.string().optional(),
  final_diagnosis: z.string().optional(),
  status: z.enum(["admitted", "discharged", "transferred", "test"]).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});

// ✅ Discharge Admission Schema
export const dischargeAdmissionSchema = z.object({
  discharge_datetime: z
    .string({ required_error: "Discharge datetime is required" })
    .datetime("Invalid date format (use ISO format)"),

  discharge_by: z
    .string({ required_error: "Discharged by (user ID) is required" })
    .uuid("Invalid user ID format").optional(),

  discharge_reason: z
    .string({ required_error: "Discharge reason is required" })
    .min(3, "Discharge reason must have at least 3 characters"),

  final_diagnosis: z.string().optional(),

  status: z.enum(["discharged"]).default("discharged"),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
