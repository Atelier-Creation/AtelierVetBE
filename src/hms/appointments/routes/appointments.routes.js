import express from "express";
import appointmentController from "../controller/appointments.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "../dto/appointments.dto.js";

const router = express.Router();

/**
 * ✅ Create Appointment
 * Roles allowed: Admin, Receptionist, Super Admin
 */
router.post(
  "/appointment",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(createAppointmentSchema),
  appointmentController.create
);

/**
 * ✅ Get All Appointments
 * Roles allowed: All authenticated users
 */
router.get("/appointment", verifyToken(), appointmentController.getAll);

/**
 * ✅ Get Appointment by ID
 */
router.get("/appointment/:id", verifyToken(), appointmentController.getById);

/**
 * ✅ Update Appointment
 * Roles allowed: Admin, Receptionist, Super Admin
 */
router.put(
  "/appointment/:id",
  verifyToken(["Admin", "Receptionist", "Super Admin"]),
  validate(updateAppointmentSchema),
  appointmentController.update
);

/**
 * ✅ Cancel (Soft Delete) Appointment
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/appointment/:id",
  verifyToken(["Admin", "Super Admin"]),
  appointmentController.delete
);

/**
 * ✅ Restore Appointment
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/appointment/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  appointmentController.restore
);

router.get("/appointmentavailability",  appointmentController.getAvailableSlots);

router.get("/appointmentsbydoctor/today", verifyToken(),  appointmentController.getAppointmentstodaybydoctorId);

export default router;
