// routes/return.routes.js
import express from "express";
import returnController from "../controller/return.controller.js";
import { verifyToken } from "../../middleware/auth.js";

const router = express.Router();

// ✅ Create a new return (optionally processed immediately if status === 'processed')
router.post("/return", verifyToken, returnController.create);

// ✅ Get all returns (with filters + pagination)
router.get("/return", verifyToken, returnController.getAll);

// ✅ Get return by ID (with items)
router.get("/return/:id", verifyToken, returnController.getById);

// ✅ Process a pending return (FIFO allocation / updates stock)
router.post("/return/:id/process", verifyToken, returnController.process);

// ✅ Update return by ID (only while pending)
router.put("/return/:id", verifyToken, returnController.update);

// ✅ Delete return by ID (soft delete)
router.delete("/return/:id", verifyToken, returnController.delete);

export default router;
