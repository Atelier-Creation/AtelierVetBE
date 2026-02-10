import express from 'express';
import returnRoutes from './return.routes.js';

const router = express.Router();

router.use('/return', returnRoutes);

export default router;