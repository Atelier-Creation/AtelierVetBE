import express from "express";
import doctorSchedulesController from "../controller/doctorschedules.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createDoctorScheduleSchema,
  updateDoctorScheduleSchema,
} from "../dto/doctorschedules.dto.js";

const router = express.Router();

/**
 * ✅ Create Doctor Schedule
 * Roles allowed: Admin, Super Admin
 */
router.post(
  "/doctor-schedule",
  verifyToken(["Admin", "Super Admin"]),
  validate(createDoctorScheduleSchema),
  doctorSchedulesController.create
);

/**
 * ✅ Get All Doctor Schedules
 * Roles allowed: All authenticated users
 */
router.get(
  "/doctor-schedule",
  verifyToken(),
  doctorSchedulesController.getAll
);

/**
 * ✅ Get Doctor Schedule by ID
 */
router.get(
  "/doctor-schedule/:id",
  verifyToken(),
  doctorSchedulesController.getById
);


router.get(
  "/doctor-schedule/doctor/:id",
  verifyToken(),
  doctorSchedulesController.getByDoctorId
);

/**
 * ✅ Update Doctor Schedule
 */
router.put(
  "/doctor-schedule/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateDoctorScheduleSchema),
  doctorSchedulesController.update
);

/**
 * ✅ Soft Delete Doctor Schedule
 */
router.delete(
  "/doctor-schedule/:id",
  verifyToken(["Admin", "Super Admin"]),
  doctorSchedulesController.delete
);

/**
 * ✅ Restore Doctor Schedule
 */
router.patch(
  "/doctor-schedule/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  doctorSchedulesController.restore
);

export default router;
