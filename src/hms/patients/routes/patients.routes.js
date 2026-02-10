import express from "express";
import patientController from "../controller/patients.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createPatientSchema, updatePatientSchema } from "../dto/patients.dto.js";

const router = express.Router();

/**
 * ✅ Create Patient
 * Roles allowed: Admin, Receptionist, Super Admin
 */
router.post(
  "/patient",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(createPatientSchema),
  patientController.create
);

/**
 * ✅ Get All Patients
 * Roles allowed: any logged-in user
 */
router.get("/patient", verifyToken(), patientController.getAll);

/**
 * ✅ Get Patient by ID
 * Roles allowed: any logged-in user
 */
router.get("/patient/:id", verifyToken(), patientController.getById);

router.get("/patient/:id/history", verifyToken(), patientController.getHistory);


router.put(
  "/patient/:id",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(updatePatientSchema),
  patientController.update
);

/**
 * ✅ Soft Delete Patient
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/patient/:id",
  verifyToken(["Admin", "Super Admin"]),
  patientController.delete
);

/**
 * ✅ Restore Soft-Deleted Patient
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/patient/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  patientController.restore
);

export default router;
