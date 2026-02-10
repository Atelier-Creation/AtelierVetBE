import express from "express";
import adminDashboardController from "../controller/admindashboard.controller.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

router.get(
  "/admindashboard",
  verifyToken(["Admin", "Super Admin"]),
  adminDashboardController.getDashboard
);

export default router;
