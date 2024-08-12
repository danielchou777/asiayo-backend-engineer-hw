import { Router } from 'express';
import { createOrder } from '../controllers/orderController.js';
import { validateOrderFields } from '../middlewares/orderValidationMiddleware.js';

const router = Router();

router.post('/orders', validateOrderFields, createOrder);

export default router;
