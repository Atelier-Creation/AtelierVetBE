import express from "express";
import clinicalNotesController from "../controller/clinicalnotes.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createClinicalNoteSchema,
  updateClinicalNoteSchema,
} from "../dto/clinicalnotes.dto.js";

const router = express.Router();

/**
 * ✅ Create Clinical Note
 * Roles allowed: Admin, Super Admin, Doctor, Nurse
 */
router.post(
  "/clinical-note",
  verifyToken(["Admin", "Super Admin", "Doctor", "Nurse"]),
  validate(createClinicalNoteSchema),
  clinicalNotesController.create
);

/**
 * ✅ Get All Clinical Notes
 * Roles allowed: All authenticated users
 */
router.get(
  "/clinical-note",
  verifyToken(),
  clinicalNotesController.getAll
);

/**
 * ✅ Get Clinical Note by ID
 */
router.get(
  "/clinical-note/:id",
  verifyToken(),
  clinicalNotesController.getById
);


router.get(
  "/clinical-notes/encounter/:id",
  verifyToken(),
  clinicalNotesController.getByEncounterId
);

/**
 * ✅ Update Clinical Note
 * Roles allowed: Admin, Super Admin, Doctor, Nurse
 */
router.put(
  "/clinical-note/:id",
  verifyToken(["Admin", "Super Admin", "Doctor", "Nurse"]),
  validate(updateClinicalNoteSchema),
  clinicalNotesController.update
);

/**
 * ✅ Delete Clinical Note (Soft Delete)
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/clinical-note/:id",
  verifyToken(["Admin", "Super Admin"]),
  clinicalNotesController.delete
);

export default router;
