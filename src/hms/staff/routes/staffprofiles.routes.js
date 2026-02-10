import express from "express";
import staffProfilesController from "../controller/staffprofiles.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createStaffProfileSchema,
  updateStaffProfileSchema,
} from "../dto/staffprofiles.dto.js";

const router = express.Router();

/**
 * ✅ Create Staff Profile
 * Roles allowed: Admin, Super Admin
 */
router.post(
  "/staffprofile",
  verifyToken(["Admin", "Super Admin"]),
  validate(createStaffProfileSchema),
  staffProfilesController.create
);

/**
 * ✅ Get All Staff Profiles
 * Roles allowed: any logged-in user
 */
router.get("/staffprofile", verifyToken(), staffProfilesController.getAll);

/**
 * ✅ Get Staff Profile by ID
 * Roles allowed: any logged-in user
 */
router.get("/staffprofile/:id", verifyToken(), staffProfilesController.getById);

/**
 * ✅ Update Staff Profile
 * Roles allowed: Admin, Super Admin
 */
router.put(
  "/staffprofile/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateStaffProfileSchema),
  staffProfilesController.update
);

/**
 * ✅ Soft Delete Staff Profile
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/staffprofile/:id",
  verifyToken(["Admin", "Super Admin"]),
  staffProfilesController.delete
);

/**
 * ✅ Restore Soft-Deleted Staff Profile
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/staffprofile/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  staffProfilesController.restore
);

export default router;
