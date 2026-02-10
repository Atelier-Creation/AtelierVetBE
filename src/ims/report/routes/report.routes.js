import express from "express";
import reportController from "../controller/report.controller.js";
import { verifyToken } from "../../middleware/auth.js";
const router = express.Router();


router.get("/users",verifyToken, reportController.getUserReport);
router.get("/billings",verifyToken, reportController.getBillingReport);


export default router;
