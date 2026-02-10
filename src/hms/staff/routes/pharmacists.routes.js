import express from "express";
import pharmacistsController from "../controller/pharmacists.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createPharmacistSchema, updatePharmacistSchema } from "../dto/pharmacists.dto.js";

const router = express.Router();

/**
 * ✅ Create Pharmacist
 * Roles allowed: Admin, Super Admin
 */
router.post(
  "/pharmacist",
  verifyToken(["Admin", "Super Admin"]),
  validate(createPharmacistSchema),
  pharmacistsController.create
);

/**
 * ✅ Get All Pharmacists
 * Roles allowed: any logged-in user
 */
router.get("/pharmacist", verifyToken(), pharmacistsController.getAll);

/**
 * ✅ Get Pharmacist by ID
 * Roles allowed: any logged-in user
 */
router.get("/pharmacist/:id", verifyToken(), pharmacistsController.getById);

/**
 * ✅ Update Pharmacist
 * Roles allowed: Admin, Super Admin
 */
router.put(
  "/pharmacist/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updatePharmacistSchema),
  pharmacistsController.update
);

/**
 * ✅ Soft Delete Pharmacist
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/pharmacist/:id",
  verifyToken(["Admin", "Super Admin"]),
  pharmacistsController.delete
);

/**
 * ✅ Restore Soft-Deleted Pharmacist
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/pharmacist/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  pharmacistsController.restore
);

export default router;
