import express from "express";
import labTestOrderController from "../controller/labtestorders.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createLabTestOrderSchema,
  updateLabTestOrderSchema,
} from "../dto/labtestorders.dto.js";

const router = express.Router();

/**
 * ✅ Create Lab Test Order
 * Roles allowed: Admin, Receptionist, Super Admin
 */
router.post(
  "/labtestorder",
  verifyToken(["Admin", "Receptionist", "Super Admin", "Lab Technician","Nurse", "Doctor"]),
  validate(createLabTestOrderSchema),
  labTestOrderController.create
);

/**
 * ✅ Get All Lab Test Orders
 * Roles allowed: All authenticated users
 */
router.get("/labtestorder", verifyToken(), labTestOrderController.getAll);

/**
 * ✅ Get Lab Test Order by ID
 */
router.get("/labtestorder/:id", verifyToken(), labTestOrderController.getById);

/**
 * ✅ Update Lab Test Order
 * Roles allowed: Admin, Receptionist, Super Admin
 */
router.put(
  "/labtestorder/:id",
  verifyToken(["Admin", "Receptionist", "Super Admin", "Doctor"]),
  validate(updateLabTestOrderSchema),
  labTestOrderController.update
);

/**
 * ✅ Cancel (Soft Delete) Lab Test Order
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/labtestorder/:id",
  verifyToken(["Admin", "Super Admin"]),
  labTestOrderController.delete
);

/**
 * ✅ Restore Lab Test Order
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/labtestorder/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  labTestOrderController.restore
);

/**
 * ✅ Get Lab Test Orders by Client
 */
router.get(
  "/labtestorder/client/:client_id",
  verifyToken(),
  labTestOrderController.getByClient
);

router.get(
  "/labtest-order/encounter/:id",
  verifyToken(),
  labTestOrderController.getByEncounterId
);


/**
 * ✅ Get Pending Lab Test Orders
 */
router.get(
  "/labtestorder/test/pending",
  verifyToken(),
  labTestOrderController.getPending
);


router.patch(
  "/labtestorder/item/:item_id/result",
  verifyToken(["Lab Technician", "Admin", "Super Admin"]),
  labTestOrderController.markResulted
);

export default router;
