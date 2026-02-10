// routes/stock.routes.js
import express from "express";
import stockController from "../controller/stock.controller.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

// ✅ Add new stock (single)
router.post('/stock', verifyToken(), stockController.create);

// ✅ Bulk add stock
router.post('/stockbulk', verifyToken(), stockController.createBulk);

// ✅ Get all stock records
router.get('/stock', verifyToken(), stockController.getAll);

// ✅ Get stock by ID
router.get('/stock/:id', verifyToken(), stockController.getById);

// ✅ Update stock by ID
router.put('/stock/:id', verifyToken(), stockController.update);

// ✅ Delete stock by ID (soft delete)
router.delete('/stock/:id', verifyToken(), stockController.delete);

export default router;
