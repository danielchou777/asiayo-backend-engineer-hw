import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

export const validateOrderFields = [
  check('id').notEmpty().withMessage('Order ID is required'),
  check('name').notEmpty().withMessage('Name is required'),
  check('address.city').notEmpty().withMessage('City is required'),
  check('address.district').notEmpty().withMessage('District is required'),
  check('address.street').notEmpty().withMessage('Street is required'),
  check('price').notEmpty().withMessage('Price is required'),
  check('currency').notEmpty().withMessage('Currency is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
