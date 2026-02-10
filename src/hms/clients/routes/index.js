import express from 'express';
import clientRoutes from './clients.routes.js';
import clientContactsRoutes from './clientcontacts.routes.js';
import clientInsuranceRoutes from './clientinsurance.routes.js';
import petRoutes from './pet.routes.js';

const router = express.Router();

router.use('/clients', clientRoutes);
router.use('/clients', clientContactsRoutes);
router.use('/clients', clientInsuranceRoutes);
router.use('/clients', petRoutes);

export default router;