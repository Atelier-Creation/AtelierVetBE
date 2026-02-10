import express from 'express';
import productRoutes from './product/routes/index.js';
import orderRoutes from './order/routes/index.js';
import vendorRoutes from './vendor/routes/index.js';
import inwardRoutes from './inward/routes/index.js';
import stockRoutes from './stock/routes/index.js';
import billingRoutes from './billing/routes/index.js';

const router = express.Router();

router.use('/ims', productRoutes);
router.use('/ims', orderRoutes);
router.use('/ims', vendorRoutes);
router.use('/ims', inwardRoutes);
router.use('/ims', stockRoutes);
router.use('/ims', billingRoutes);

export default router;