import express from "express";
import diagnosesController from "../controller/diagnoses.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createDiagnosisSchema, updateDiagnosisSchema } from "../dto/diagnoses.dto.js";

const router = express.Router();

/**
 * ✅ Create Diagnosis
 * Roles allowed: Admin, Super Admin, Doctor
 */
router.post(
  "/diagnosis",
  verifyToken(["Admin", "Super Admin", "Doctor"]),
  validate(createDiagnosisSchema),
  diagnosesController.create
);

/**
 * ✅ Get All Diagnoses
 * Roles allowed: All authenticated users
 */
router.get(
  "/diagnosis",
  verifyToken(),
  diagnosesController.getAll
);

/**
 * ✅ Get Diagnosis by ID
 */
router.get(
  "/diagnosis/:id",
  verifyToken(),
  diagnosesController.getById
);

router.get(
  "/diagnosis/encounter/:id",
  verifyToken(),
  diagnosesController.getByEncounterId
);

/**
 * ✅ Update Diagnosis
 * Roles allowed: Admin, Super Admin, Doctor
 */
router.put(
  "/diagnosis/:id",
  verifyToken(["Admin", "Super Admin", "Doctor"]),
  validate(updateDiagnosisSchema),
  diagnosesController.update
);

/**
 * ✅ Delete Diagnosis (Soft Delete)
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/diagnosis/:id",
  verifyToken(["Admin", "Super Admin"]),
  diagnosesController.delete
);

export default router;