import express from 'express';
import reportRouters from './report.routes.js';

const router = express.Router();

router.use('/report', reportRouters);

export default router;