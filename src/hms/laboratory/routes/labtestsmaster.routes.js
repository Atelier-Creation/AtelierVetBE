import express from "express";
import labTestController from "../controller/labtestsmaster.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createLabTestSchema,
  updateLabTestSchema,
} from "../dto/labtestsmaster.dto.js";

const router = express.Router();

router.post(
  "/labtest",
  verifyToken(["Admin", "Super Admin"]),
  validate(createLabTestSchema),
  labTestController.create
);

router.get("/labtest", verifyToken(), labTestController.getAll);

router.get("/labtest/:id", verifyToken(), labTestController.getById);

router.put(
  "/labtest/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateLabTestSchema),
  labTestController.update
);

router.delete(
  "/labtest/:id",
  verifyToken(["Admin", "Super Admin"]),
  labTestController.delete
);

router.patch(
  "/labtest/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  labTestController.restore
);

export default router;
