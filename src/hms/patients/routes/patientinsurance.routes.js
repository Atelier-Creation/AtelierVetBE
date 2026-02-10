import express from "express";
import patientInsuranceController from "../controller/patientinsurance.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createPatientInsuranceSchema,
  updatePatientInsuranceSchema,
} from "../dto/patientinsurance.dto.js";

const router = express.Router();

/**
 * ✅ Create Patient Insurance
 * Roles allowed: Admin, Receptionist, Super Admin
 */
router.post(
  "/patient-insurance",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(createPatientInsuranceSchema),
  patientInsuranceController.create
);

/**
 * ✅ Get All Patient Insurances
 * Roles allowed: any logged-in user
 */
router.get("/patient-insurance", verifyToken(), patientInsuranceController.getAll);

/**
 * ✅ Get Patient Insurance by ID
 * Roles allowed: any logged-in user
 */
router.get("/patient-insurance/:id", verifyToken(), patientInsuranceController.getById);

/**
 * ✅ Update Patient Insurance
 * Roles allowed: Admin, Receptionist, Super Admin
 */
router.put(
  "/patient-insurance/:id",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(updatePatientInsuranceSchema),
  patientInsuranceController.update
);

/**
 * ✅ Soft Delete Patient Insurance
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/patient-insurance/:id",
  verifyToken(["Admin", "Super Admin"]),
  patientInsuranceController.delete
);

/**
 * ✅ Restore Soft-Deleted Patient Insurance
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/patient-insurance/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  patientInsuranceController.restore
);

export default router;
