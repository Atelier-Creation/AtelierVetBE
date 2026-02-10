import express from "express";
import clientContactsController from "../controller/clientcontacts.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { createClientContactSchema, updateClientContactSchema } from "../dto/clientcontacts.dto.js";

const router = express.Router();


router.post(
  "/client-contact",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(createClientContactSchema),
  clientContactsController.create
);

router.get("/client-contact", verifyToken(), clientContactsController.getAll);

router.get("/client-contact/:id", verifyToken(), clientContactsController.getById);

router.put(
  "/client-contact/:id",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(updateClientContactSchema),
  clientContactsController.update
);

router.delete(
  "/client-contact/:id",
  verifyToken(["Admin", "Super Admin"]),
  clientContactsController.delete
);

router.patch(
  "/client-contact/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  clientContactsController.restore
);

export default router;
