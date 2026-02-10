import express from "express";
import wardRoutes from "./wards.routes.js";
import roomRoutes from "./rooms.routes.js";
import bedRoutes from "./beds.routes.js";
import admissionRoutes from "./admissions.routes.js";
import bedtransferRoutes from "./bedtransfers.routes.js";


const router = express.Router();

router.use("/admissions", wardRoutes);
router.use("/admissions", roomRoutes);
router.use("/admissions", bedRoutes);
router.use("/admissions", admissionRoutes);  
router.use("/admissions", bedtransferRoutes);

export default router;