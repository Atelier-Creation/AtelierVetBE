// routes/vendor.routes.js
import express from "express";
import vendorController from "../controller/vendor.controller.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

// ✅ Create a new vendor
router.post("/vendor", verifyToken(), vendorController.create);

// ✅ Get all vendors
router.get("/vendor", verifyToken(), vendorController.getAll);

// ✅ Get vendor by ID
router.get("/vendor/:id", verifyToken(), vendorController.getById);

// ✅ Get vendor by code
router.get("/vendor/code/:code", verifyToken(), vendorController.getByCode);

// ✅ Update vendor by ID
router.put("/vendor/:id", verifyToken(), vendorController.update);

// ✅ Soft delete vendor by ID
router.delete("/vendor/:id", verifyToken(), vendorController.delete);

export default router;
