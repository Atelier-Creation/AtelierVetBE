import express from "express";
import clientInsuranceController from "../controller/clientinsurance.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createClientInsuranceSchema,
  updateClientInsuranceSchema,
} from "../dto/clientinsurance.dto.js";

const router = express.Router();

/**
 * ✅ Create Client Insurance
 * Roles allowed: Admin, Receptionist, Super Admin
 */
router.post(
  "/client-insurance",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(createClientInsuranceSchema),
  clientInsuranceController.create
);

/**
 * ✅ Get All Client Insurances
 * Roles allowed: any logged-in user
 */
router.get("/client-insurance", verifyToken(), clientInsuranceController.getAll);

/**
 * ✅ Get Client Insurance by ID
 * Roles allowed: any logged-in user
 */
router.get("/client-insurance/:id", verifyToken(), clientInsuranceController.getById);

/**
 * ✅ Update Client Insurance
 * Roles allowed: Admin, Receptionist, Super Admin
 */
router.put(
  "/client-insurance/:id",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(updateClientInsuranceSchema),
  clientInsuranceController.update
);

/**
 * ✅ Soft Delete Client Insurance
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/client-insurance/:id",
  verifyToken(["Admin", "Super Admin"]),
  clientInsuranceController.delete
);

/**
 * ✅ Restore Soft-Deleted Client Insurance
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/client-insurance/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  clientInsuranceController.restore
);

export default router;
