import express from 'express';
import staffProfilesRoutes from './staffprofiles.routes.js';
import doctorRoutes from './doctor.routes.js';
import nursesRouter from './nurses.routes.js';
import receptionistsRouter from './receptionists.routes.js';
import pharmacistsRouter from './pharmacists.routes.js';
import labTechniciansRouter from './labtechnicians.routes.js';
import accountantsRouter from './accountants.routes.js';

const router = express.Router();

router.use('/staff', staffProfilesRoutes);
router.use('/staff', doctorRoutes);
router.use('/staff', nursesRouter);
router.use('/staff', receptionistsRouter);
router.use('/staff', pharmacistsRouter);
router.use('/staff', labTechniciansRouter);
router.use('/staff', accountantsRouter);

export default router;