import express from 'express';
import billingRoutes from './billing.routes.js';

const router = express.Router();

router.use('/billing', billingRoutes);

export default router;  