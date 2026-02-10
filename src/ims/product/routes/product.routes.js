// routes/product.routes.js
import express from "express";
import productController from "../controller/product.controlller.js";
import { verifyToken } from "../../../middleware/auth.js";


const router = express.Router();

// ✅ Create a new product
router.post('/product',verifyToken(), productController.create);

// ✅ Get all products
router.get('/product',verifyToken(), productController.getAll);

// ✅ Get product by ID
router.get('/product/:id',verifyToken(), productController.getById);

router.get('/product/code/:code',verifyToken(), productController.getByCode);

// ✅ Update product by ID
router.put('/product/:id',verifyToken(), productController.update);

// ✅ Delete product by ID
router.delete('/product/:id',verifyToken(), productController.delete);

export default router;
