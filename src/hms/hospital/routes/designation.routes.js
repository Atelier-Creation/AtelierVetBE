import express from "express";
import designationController from "../controller/designation.controller.js";
import { verifyToken } from "../../../middleware/auth.js"; // authentication middleware
import { validate } from "../../../middleware/validate.js";
import {
  createDesignationSchema,
  updateDesignationSchema,
} from "../dto/designation.dto.js";

const router = express.Router();

router.post(
  "/designation",
  verifyToken(["Admin", "Super Admin"]),
  validate(createDesignationSchema),
  designationController.create
);

router.get("/designation", verifyToken(), designationController.getAll);

router.get("/designation/:id", verifyToken(), designationController.getById);

router.put(
  "/designation/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateDesignationSchema),
  designationController.update
);

router.delete(
  "/designation/:id",
  verifyToken(["Admin", "Super Admin"]),
  designationController.delete
);

router.patch(
  "/designation/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  designationController.restore
);

export default router;
