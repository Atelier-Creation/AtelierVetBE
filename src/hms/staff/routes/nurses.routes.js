import express from "express";
import nursesController from "../controller/nurses.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createNurseSchema, updateNurseSchema } from "../dto/nurses.dto.js";

const router = express.Router();

/**
 * ✅ Create Nurse
 * Roles allowed: Admin, Super Admin
 */
router.post(
  "/nurse",
  verifyToken(["Admin", "Super Admin"]),
  validate(createNurseSchema),
  nursesController.create
);

/**
 * ✅ Get All Nurses
 * Roles allowed: any logged-in user
 */
router.get("/nurse", verifyToken(), nursesController.getAll);

/**
 * ✅ Get Nurse by ID
 * Roles allowed: any logged-in user
 */
router.get("/nurse/:id", verifyToken(), nursesController.getById);

/**
 * ✅ Update Nurse
 * Roles allowed: Admin, Super Admin
 */
router.put(
  "/nurse/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateNurseSchema),
  nursesController.update
);

/**
 * ✅ Soft Delete Nurse
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/nurse/:id",
  verifyToken(["Admin", "Super Admin"]),
  nursesController.delete
);

/**
 * ✅ Restore Soft-Deleted Nurse
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/nurse/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  nursesController.restore
);

export default router;