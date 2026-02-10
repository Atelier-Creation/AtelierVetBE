import express from "express";
import ProceduresRoutes from "./procedures.routes.js";

const router = express.Router();

router.use("/surgeries", ProceduresRoutes);

export default router;