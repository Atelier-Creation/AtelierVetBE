import express from "express";
import wardsController from "../controller/wards.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createWardSchema, updateWardSchema } from "../dto/wards.dto.js";

const router = express.Router();

// ✅ Create a new ward
router.post(
  "/ward",
  verifyToken(["Admin", "Super Admin"]),
  validate(createWardSchema),
  wardsController.create
);

// ✅ Get all wards
router.get("/ward", verifyToken(), wardsController.getAll);

// ✅ Get ward by ID
router.get("/ward/:id", verifyToken(), wardsController.getById);

// ✅ Update ward
router.put(
  "/ward/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateWardSchema),
  wardsController.update
);

// ✅ Soft delete ward
router.delete(
  "/ward/:id",
  verifyToken(["Admin", "Super Admin"]),
  wardsController.delete
);

// ✅ Restore soft-deleted ward
router.patch(
  "/ward/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  wardsController.restore
);

export default router;
