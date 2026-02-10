import express from 'express';
import encountersRoutes from './encounters.routes.js';
import vitalsRoutes from './vitals.routes.js';
import diagnosesRoutes from './diagnoses.routes.js';
import clinicalnotesRoutes from './clinicalnotes.routes.js'

const router = express.Router();

router.use('/clinical', encountersRoutes);
router.use('/clinical', vitalsRoutes);
router.use('/clinical', diagnosesRoutes);
router.use('/clinical', clinicalnotesRoutes);

export default router;