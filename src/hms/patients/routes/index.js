import express from 'express';
import patientRoutes from './patients.routes.js';
import patientContactsRoutes from './patientcontacts.routes.js';
import patientInsuranceRoutes from './patientinsurance.routes.js';

const router = express.Router();

router.use('/patients', patientRoutes);
router.use('/patients', patientContactsRoutes);
router.use('/patients', patientInsuranceRoutes);

export default router;