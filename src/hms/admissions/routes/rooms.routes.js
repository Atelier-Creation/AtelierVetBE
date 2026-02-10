import express from "express";
import roomsController from "../controller/rooms.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createRoomSchema, updateRoomSchema } from "../dto/rooms.dto.js";

const router = express.Router();

/**
 * ✅ Create Room
 * Roles allowed: Admin, Super Admin
 */
router.post(
  "/room",
  verifyToken(["Admin", "Super Admin"]),
  validate(createRoomSchema),
  roomsController.create
);

/**
 * ✅ Get All Rooms
 * Roles allowed: any logged-in user
 */
router.get("/room", verifyToken(), roomsController.getAll);

/**
 * ✅ Get Room by ID
 * Roles allowed: any logged-in user
 */
router.get("/room/:id", verifyToken(), roomsController.getById);

/**
 * ✅ Update Room
 * Roles allowed: Admin, Super Admin
 */
router.put(
  "/room/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateRoomSchema),
  roomsController.update
);

/**
 * ✅ Soft Delete Room
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/room/:id",
  verifyToken(["Admin", "Super Admin"]),
  roomsController.delete
);

/**
 * ✅ Restore Soft-Deleted Room
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/room/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  roomsController.restore
);

export default router;
