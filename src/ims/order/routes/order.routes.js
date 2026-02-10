import express from "express";
import orderController from "../controller/order.controller.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

router.post("/order", verifyToken(), orderController.create);

router.get("/order", verifyToken(), orderController.getAll);

router.get("/order/:id", verifyToken(), orderController.getById);

router.put("/order/:id", verifyToken(), orderController.update);

router.delete("/order/:id", verifyToken(), orderController.delete);

export default router;
