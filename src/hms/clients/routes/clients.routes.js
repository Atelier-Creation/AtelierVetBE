import express from "express";
import clientController from "../controller/clients.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createClientSchema, updateClientSchema } from "../dto/clients.dto.js";

const router = express.Router();

/**
 * ✅ Create Client
 * Roles allowed: Admin, Receptionist, Super Admin
 */
router.post(
  "/client",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(createClientSchema),
  clientController.create
);

/**
 * ✅ Get All Clients
 * Roles allowed: any logged-in user
 */
router.get("/client", verifyToken(), clientController.getAll);

/**
 * ✅ Get Client by ID
 * Roles allowed: any logged-in user
 */
router.get("/client/:id", verifyToken(), clientController.getById);

router.get("/client/:id/history", verifyToken(), clientController.getHistory);


router.put(
  "/client/:id",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(updateClientSchema),
  clientController.update
);

/**
 * ✅ Soft Delete Client
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/client/:id",
  verifyToken(["Admin", "Super Admin"]),
  clientController.delete
);

/**
 * ✅ Restore Soft-Deleted Client
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/client/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  clientController.restore
);

export default router;
