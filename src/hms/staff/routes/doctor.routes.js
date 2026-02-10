import express from "express";
import doctorController from "../controller/doctor.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createDoctorSchema, updateDoctorSchema } from "../dto/doctor.dto.js";

const router = express.Router();

/**
 * ✅ Create Doctor
 * Roles allowed: Admin, Super Admin
 */
router.post(
  "/doctor",
  verifyToken(["Admin", "Super Admin"]),
  validate(createDoctorSchema),
  doctorController.create
);

/**
 * ✅ Get All Doctors
 * Roles allowed: any logged-in user
 */
router.get("/doctor", verifyToken(), doctorController.getAll);

/**
 * ✅ Get Doctor by ID
 * Roles allowed: any logged-in user
 */
router.get("/doctor/:id", verifyToken(), doctorController.getById);

/**
 * ✅ Update Doctor
 * Roles allowed: Admin, Super Admin
 */
router.put(
  "/doctor/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateDoctorSchema),
  doctorController.update
);

/**
 * ✅ Soft Delete Doctor
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/doctor/:id",
  verifyToken(["Admin", "Super Admin"]),
  doctorController.delete
);

/**
 * ✅ Restore Soft-Deleted Doctor
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/doctor/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  doctorController.restore
);

export default router;
