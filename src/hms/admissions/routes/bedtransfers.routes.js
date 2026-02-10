import express from "express";
import bedTransfersController from "../controller/bedtransfers.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createBedTransferSchema,
  updateBedTransferSchema,
} from "../dto/bedtransfers.dto.js";

const router = express.Router();

/**
 * ✅ Create Bed Transfer
 * Roles allowed: Doctor, Admin, Super Admin
 */
router.post(
  "/bed-transfer",
  verifyToken(["Doctor", "Admin", "Super Admin"]),
  validate(createBedTransferSchema),
  bedTransfersController.create
);

/**
 * ✅ Get All Bed Transfers
 * Roles allowed: any logged-in user
 */
router.get("/bed-transfer", verifyToken(), bedTransfersController.getAll);

/**
 * ✅ Get Bed Transfer by ID
 * Roles allowed: any logged-in user
 */
router.get("/bed-transfer/:id", verifyToken(), bedTransfersController.getById);

/**
 * ✅ Update Bed Transfer (optional)
 * Roles allowed: Doctor, Admin, Super Admin
 */
router.put(
  "/bed-transfer/:id",
  verifyToken(["Doctor", "Admin", "Super Admin"]),
  validate(updateBedTransferSchema),
  bedTransfersController.update
);

/**
 * ✅ Delete Bed Transfer (soft delete)
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/bed-transfer/:id",
  verifyToken(["Admin", "Super Admin"]),
  bedTransfersController.delete
);

/**
 * ✅ Restore Bed Transfer (undo soft delete)
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/bed-transfer/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  bedTransfersController.restore
);

export default router;
