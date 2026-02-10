// routes/billing.routes.js
import express from "express";
import billingController from "../controller/billing.controller.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

router.post("/billing", verifyToken(), billingController.create);

router.get("/billing", verifyToken(), billingController.getAll);

router.get("/billing/:id", verifyToken(), billingController.getById);

router.put("/billing/:id", verifyToken(), billingController.update);

router.delete("/billing/:id", verifyToken(), billingController.delete);

export default router;
