import express from "express";
import encountersController from "../controller/encounters.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createEncounterSchema,
  updateEncounterSchema,
} from "../dto/encounters.dto.js";

const router = express.Router();

/**
 * ✅ Create Encounter
 * Roles allowed: Admin, Super Admin, Doctor
 */
router.post(
  "/encounter",
  verifyToken(["Admin", "Super Admin", "Doctor"]),
  validate(createEncounterSchema),
  encountersController.create
);

/**
 * ✅ Get All Encounters
 * Roles allowed: All authenticated users
 */
router.get(
  "/encounter",
  verifyToken(),
  encountersController.getAll
);

router.get(
  "/encounter/:id",
  verifyToken(),
  encountersController.getById
);

router.get(
  "/encounter/admission/:admission_id",
  verifyToken(),
  encountersController.getByAdmissionId
);


router.put(
  "/encounter/:id",
  verifyToken(["Admin", "Super Admin", "Doctor"]),
  validate(updateEncounterSchema),
  encountersController.update
);

router.delete(
  "/encounter/:id",
  verifyToken(["Admin", "Super Admin"]),
  encountersController.delete
);

router.patch(
  "/encounter/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  encountersController.restore
);

export default router;
