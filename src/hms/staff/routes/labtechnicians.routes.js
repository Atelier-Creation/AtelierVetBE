import express from "express";
import labTechniciansController from "../controller/labtechnicians.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createLabTechnicianSchema, updateLabTechnicianSchema } from "../dto/labtechnicians.dto.js";

const router = express.Router();

/**
 * ✅ Create Lab Technician
 * Roles allowed: Admin, Super Admin
 */
router.post(
  "/labtechnician",
  verifyToken(["Admin", "Super Admin"]),
  validate(createLabTechnicianSchema),
  labTechniciansController.create
);

/**
 * ✅ Get All Lab Technicians
 * Roles allowed: any logged-in user
 */
router.get("/labtechnician", verifyToken(), labTechniciansController.getAll);

/**
 * ✅ Get Lab Technician by ID
 * Roles allowed: any logged-in user
 */
router.get("/labtechnician/:id", verifyToken(), labTechniciansController.getById);

/**
 * ✅ Update Lab Technician
 * Roles allowed: Admin, Super Admin
 */
router.put(
  "/labtechnician/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateLabTechnicianSchema),
  labTechniciansController.update
);

/**
 * ✅ Soft Delete Lab Technician
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/labtechnician/:id",
  verifyToken(["Admin", "Super Admin"]),
  labTechniciansController.delete
);

/**
 * ✅ Restore Soft-Deleted Lab Technician
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/labtechnician/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  labTechniciansController.restore
);

export default router;
