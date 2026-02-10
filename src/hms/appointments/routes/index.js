import express from 'express';
import doctorschedulesRouter from './doctorschedules.routes.js';
import appointmentsRouter from './appointments.routes.js';

const router = express.Router();

router.use('/appointments', doctorschedulesRouter);
router.use('/appointments', appointmentsRouter);

export default router;