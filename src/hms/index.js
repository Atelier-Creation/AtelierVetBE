import express from 'express';
import hosptalRoutes from './hospital/routes/index.js';
import laboratoryRoutes from './laboratory/routes/index.js';
import admissionsRoutes from './admissions/routes/index.js';
import surgeriesRoute from './surgeries/routes/index.js';
import staffRoute from './staff/routes/index.js';
import patientRoutes from './patients/routes/index.js';
import appointmentsRoutes from './appointments/routes/index.js';
import clinicalRoutes from './clinical/routes/index.js';
import dashboardRoutes from './dashboard/routes/index.js';

const router = express.Router();

router.use('/hms', hosptalRoutes);
router.use('/hms', laboratoryRoutes);
router.use('/hms', admissionsRoutes);
router.use('/hms', surgeriesRoute);
router.use('/hms', staffRoute);
router.use('/hms', patientRoutes);
router.use('/hms', appointmentsRoutes);
router.use('/hms', clinicalRoutes);
router.use('/hms', dashboardRoutes);


export default router;