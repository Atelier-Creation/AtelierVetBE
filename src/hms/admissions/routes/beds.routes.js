import express from "express";
import bedsController from "../controller/beds.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createBedSchema, updateBedSchema } from "../dto/beds.dto.js";

const router = express.Router();

/**
 * ✅ Create Bed
 * Roles allowed: Admin, Super Admin
 */
router.post(
  "/bed",
  verifyToken(["Admin", "Super Admin"]),
  validate(createBedSchema),
  bedsController.create
);

/**
 * ✅ Get All Beds
 * Roles allowed: any logged-in user
 */
router.get("/bed", verifyToken(), bedsController.getAll);

/**
 * ✅ Get Bed by ID
 * Roles allowed: any logged-in user
 */
router.get("/bed/:id", verifyToken(), bedsController.getById);

/**
 * ✅ Update Bed
 * Roles allowed: Admin, Super Admin
 */
router.put(
  "/bed/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateBedSchema),
  bedsController.update
);

/**
 * ✅ Soft Delete Bed
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/bed/:id",
  verifyToken(["Admin", "Super Admin"]),
  bedsController.delete
);

/**
 * ✅ Restore Soft-Deleted Bed
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/bed/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  bedsController.restore
);

export default router;
