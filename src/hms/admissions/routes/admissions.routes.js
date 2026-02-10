import express from "express";
import admissionsController from "../controller/admissions.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createAdmissionSchema,
  updateAdmissionSchema,
  dischargeAdmissionSchema,
} from "../dto/admissions.dto.js";

const router = express.Router();

/**
 * ✅ Create Admission
 * Roles allowed: Doctor, Admin, Super Admin
 */
router.post(
  "/admission",
  verifyToken(["Doctor","Receptionist", "Admin", "Super Admin"]),
  validate(createAdmissionSchema),
  admissionsController.create
);

/**
 * ✅ Get All Admissions
 * Roles allowed: any logged-in user
 */
router.get("/admission", verifyToken(), admissionsController.getAll);

/**
 * ✅ Get Admission by ID
 * Roles allowed: any logged-in user
 */
router.get("/admission/:id", verifyToken(), admissionsController.getById);

/**
 * ✅ Update Admission (e.g., transfer room/bed)
 * Roles allowed: Doctor, Admin, Super Admin
 */
router.put(
  "/admission/:id",
  verifyToken(["Doctor", "Admin", "Super Admin"]),
  validate(updateAdmissionSchema),
  admissionsController.update
);

/**
 * ✅ Discharge Client
 * Roles allowed: Doctor, Admin, Super Admin
 */
router.put(
  "/admission/:id/discharge",
  verifyToken(["Doctor", "Receptionist", "Admin", "Super Admin"]),
  validate(dischargeAdmissionSchema),
  admissionsController.discharge
);

/**
 * ✅ Soft Delete Admission
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/admission/:id",
  verifyToken(["Admin", "Super Admin"]),
  admissionsController.delete
);

/**
 * ✅ Restore Soft-Deleted Admission
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/admission/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  admissionsController.restore
);

export default router;
