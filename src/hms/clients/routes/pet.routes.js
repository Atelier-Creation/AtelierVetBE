import express from "express";
import petController from "../controller/pet.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createPetSchema, updatePetSchema } from "../dto/pet.dto.js";

const router = express.Router();

/**
 * ✅ Create pet
 */
router.post(
  "/pet",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(createPetSchema),
  petController.create
);

/**
 * ✅ Get all pets
 */
router.get(
  "/pet",
  verifyToken(),
  petController.getAll
);

/**
 * ✅ Get pet by ID
 */
router.get(
  "/pet/:id",
  verifyToken(),
  petController.getById
);

/**
 * ✅ Update pet
 */
router.put(
  "/pet/:id",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(updatePetSchema),
  petController.update
);

/**
 * ✅ Soft delete pet
 */
router.delete(
  "/pet/:id",
  verifyToken(["Admin", "Super Admin"]),
  petController.delete
);

/**
 * ✅ Restore pet
 */
router.patch(
  "/pet/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  petController.restore
);

export default router;
