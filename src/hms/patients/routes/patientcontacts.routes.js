import express from "express";
import patientContactsController from "../controller/patientcontacts.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createPatientContactSchema, updatePatientContactSchema } from "../dto/patientcontacts.dto.js";

const router = express.Router();


router.post(
  "/patient-contact",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(createPatientContactSchema),
  patientContactsController.create
);

router.get("/patient-contact", verifyToken(), patientContactsController.getAll);

router.get("/patient-contact/:id", verifyToken(), patientContactsController.getById);

router.put(
  "/patient-contact/:id",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(updatePatientContactSchema),
  patientContactsController.update
);

router.delete(
  "/patient-contact/:id",
  verifyToken(["Admin", "Super Admin"]),
  patientContactsController.delete
);

router.patch(
  "/patient-contact/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  patientContactsController.restore
);

export default router;
