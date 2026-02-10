import express from "express";
import receptionistsController from "../controller/receptionists.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createReceptionistSchema,
  updateReceptionistSchema,
} from "../dto/receptionists.dto.js";

const router = express.Router();

/**
 * ✅ Create Receptionist
 * Roles allowed: Admin, Super Admin
 */
router.post(
  "/receptionist",
  verifyToken(["Admin", "Super Admin"]),
  validate(createReceptionistSchema),
  receptionistsController.create
);

/**
 * ✅ Get All Receptionists
 * Roles allowed: any logged-in user
 */
router.get("/receptionist", verifyToken(), receptionistsController.getAll);

/**
 * ✅ Get Receptionist by ID
 * Roles allowed: any logged-in user
 */
router.get("/receptionist/:id", verifyToken(), receptionistsController.getById);

/**
 * ✅ Update Receptionist
 * Roles allowed: Admin, Super Admin
 */
router.put(
  "/receptionist/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateReceptionistSchema),
  receptionistsController.update
);

/**
 * ✅ Soft Delete Receptionist
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/receptionist/:id",
  verifyToken(["Admin", "Super Admin"]),
  receptionistsController.delete
);

/**
 * ✅ Restore Soft-Deleted Receptionist
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/receptionist/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  receptionistsController.restore
);

export default router;
