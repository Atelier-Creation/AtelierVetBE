import express from 'express';
import departmentRoutes from './department.routes.js';
import designationRoutes from './designation.routes.js';

const router = express.Router();

router.use('/hospital', departmentRoutes);
router.use('/hospital', designationRoutes);

export default router;