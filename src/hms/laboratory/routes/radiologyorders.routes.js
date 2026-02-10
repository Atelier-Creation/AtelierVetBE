import express from "express";
import radiologyOrderController from "../controller/radiologyorders.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createRadiologyOrderSchema,
  updateRadiologyOrderSchema,
} from "../dto/radiologyorders.dto.js";

const router = express.Router();


router.post(
  "/radiologyorder",
  verifyToken(["Admin", "Receptionist", "Super Admin", "Radiologist", "Doctor"]),
  validate(createRadiologyOrderSchema),
  radiologyOrderController.create
);

router.get("/radiologyorder", verifyToken(), radiologyOrderController.getAll);

router.get("/radiologyorder/:id", verifyToken(), radiologyOrderController.getById);

router.put(
  "/radiologyorder/:id",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(updateRadiologyOrderSchema),
  radiologyOrderController.update
);

router.delete(
  "/radiologyorder/:id",
  verifyToken(["Admin", "Super Admin"]),
  radiologyOrderController.delete
);

router.patch(
  "/radiologyorder/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  radiologyOrderController.restore
);

router.get(
  "/radiologyorder/patient/:patient_id",
  verifyToken(),
  radiologyOrderController.getByPatient
);

router.get(
  "/radiologyorder/test/pending",
  verifyToken(),
  radiologyOrderController.getPending
);

router.patch(
  "/radiologyorder/item/:item_id/result",
  verifyToken(["Radiologist", "Admin", "Super Admin"]),
  radiologyOrderController.markResulted
);

export default router;
