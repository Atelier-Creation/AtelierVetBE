import express from "express";
import vitalsController from "../controller/vitals.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createVitalsSchema, updateVitalsSchema } from "../dto/vitals.dto.js";

const router = express.Router();

/**
 * ✅ Create Vitals
 * Roles allowed: Admin, Super Admin, Nurse, Doctor
 */
router.post(
  "/vitals",
  verifyToken(["Admin", "Super Admin", "Doctor", "Nurse"]),
  validate(createVitalsSchema),
  vitalsController.create
);

/**
 * ✅ Get All Vitals
 * Roles allowed: All authenticated users
 */
router.get(
  "/vitals",
  verifyToken(),
  vitalsController.getAll
);

/**
 * ✅ Get Vitals by ID
 */
router.get(
  "/vitals/:id",
  verifyToken(),
  vitalsController.getById
);

router.get(
  "/vitals/encounter/:id",
  verifyToken(),
  vitalsController.getByEncountorId
);

/**
 * ✅ Update Vitals
 * Roles allowed: Admin, Super Admin, Nurse, Doctor
 */
router.put(
  "/vitals/:id",
  verifyToken(["Admin", "Super Admin", "Doctor", "Nurse"]),
  validate(updateVitalsSchema),
  vitalsController.update
);

/**
 * ✅ Delete Vitals
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/vitals/:id",
  verifyToken(["Admin", "Super Admin"]),
  vitalsController.delete
);

export default router;
