import express from 'express';
import labDashboardRoutes from './labdashboard.routes.js';
import admindashboardRoutes from './admindashboard.routes.js';

const router = express.Router();

router.use('/dashboard', labDashboardRoutes);
router.use('/dashboard', admindashboardRoutes);

export default router;