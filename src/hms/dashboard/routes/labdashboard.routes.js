import express from "express";
import labDashboardController from "../controller/labdashboard.controller.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

/**
 * ✅ Get Lab Dashboard Summary
 * Roles allowed: Admin, Lab Technician, Doctor, Nurse, Super Admin
 */
router.get(
  "/labdashboard",
  verifyToken(["Admin", "Lab Technician", "Doctor", "Nurse", "Super Admin"]),
  labDashboardController.getDashboard
);

export default router;
