import express from "express";
import proceduresController from "../controller/procedures.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createProcedureSchema,
  updateProcedureSchema,
} from "../dto/procedures.dto.js";

const router = express.Router();

// Create procedure
router.post(
  "/procedure",
  verifyToken(["Admin", "Super Admin"]),
  validate(createProcedureSchema),
  proceduresController.create
);

// Get all procedures
router.get("/procedure", verifyToken(), proceduresController.getAll);

// Get procedure by ID
router.get("/procedure/:id", verifyToken(), proceduresController.getById);

// Update procedure
router.put(
  "/procedure/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateProcedureSchema),
  proceduresController.update
);

// Soft delete procedure
router.delete(
  "/procedure/:id",
  verifyToken(["Admin", "Super Admin"]),
  proceduresController.delete
);

// Restore soft-deleted procedure
router.patch(
  "/procedure/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  proceduresController.restore
);

export default router;
