import express from "express";
import departmentController from "../controller/department.controller.js";
import { verifyToken } from "../../../middleware/auth.js"; // renamed to match your auth.js
import {validate} from "../../../middleware/validate.js";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../dto/department.dto.js";

const router = express.Router();

router.post(
  "/department",
  verifyToken(["Admin", "Super Admin"]),
  validate(createDepartmentSchema),
  departmentController.create
);

router.get("/department", verifyToken(), departmentController.getAll);

router.get("/department/:id", verifyToken(), departmentController.getById);

router.put(
  "/department/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateDepartmentSchema),
  departmentController.update
);

router.delete("/department/:id", verifyToken(["Admin", "Super Admin"]), departmentController.delete);

router.patch("/department/:id/restore", verifyToken(["Admin", "Super Admin"]), departmentController.restore);

export default router;
