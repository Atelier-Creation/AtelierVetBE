import express from "express";
import accountantsController from "../controller/accountants.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createAccountantSchema, updateAccountantSchema } from "../dto/accountants.dto.js";

const router = express.Router();

/**
 * ✅ Create Accountant
 * Roles allowed: Admin, Super Admin
 */
router.post(
  "/accountant",
  verifyToken(["Admin", "Super Admin"]),
  validate(createAccountantSchema),
  accountantsController.create
);

/**
 * ✅ Get All Accountants
 * Roles allowed: any logged-in user
 */
router.get("/accountant", verifyToken(), accountantsController.getAll);

/**
 * ✅ Get Accountant by ID
 * Roles allowed: any logged-in user
 */
router.get("/accountant/:id", verifyToken(), accountantsController.getById);

/**
 * ✅ Update Accountant
 * Roles allowed: Admin, Super Admin
 */
router.put(
  "/accountant/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateAccountantSchema),
  accountantsController.update
);

/**
 * ✅ Soft Delete Accountant
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/accountant/:id",
  verifyToken(["Admin", "Super Admin"]),
  accountantsController.delete
);

/**
 * ✅ Restore Soft-Deleted Accountant
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/accountant/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  accountantsController.restore
);

export default router;
