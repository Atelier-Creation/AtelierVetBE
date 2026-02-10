import express from 'express';
import VendorRoute from './vendor.routes.js';

const router = express.Router();

router.use('/vendor', VendorRoute);

export default router;