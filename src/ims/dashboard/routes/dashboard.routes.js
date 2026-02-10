// routes/dashboard.routes.js
import express from "express";
import {getDashboardSummary ,getRecentBills,getRevenueByDate} from "../controller/dashboard.controller.js";
import { verifyToken } from "../../middleware/auth.js";

const router = express.Router();

// ✅ Dashboard summary (total bills, users, products, revenue)
router.get("/summary", verifyToken, getDashboardSummary);

// ✅ Recent bills with items
router.get("/recent-bills", verifyToken, getRecentBills);

// ✅ Revenue grouped by date (last 7 days)
router.get("/revenue", verifyToken, getRevenueByDate);

export default router;
