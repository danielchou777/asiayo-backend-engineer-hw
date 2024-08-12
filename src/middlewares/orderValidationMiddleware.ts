import { Request, Response, NextFunction } from 'express';
import { check, validationResult, CustomValidator } from 'express-validator';

const isNotEmptyOrWhitespace: CustomValidator = (value) =>
  value.trim().length > 0;

export const validateOrderFields = [
  check('id').notEmpty().withMessage('Order ID is required'),

  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .custom(isNotEmptyOrWhitespace)
    .withMessage('Name cannot contain only whitespace'),

  check('address.city')
    .notEmpty()
    .withMessage('City is required')
    .bail()
    .custom(isNotEmptyOrWhitespace)
    .withMessage('City cannot contain only whitespace'),

  check('address.district')
    .notEmpty()
    .withMessage('District is required')
    .bail()
    .custom(isNotEmptyOrWhitespace)
    .withMessage('District cannot contain only whitespace'),

  check('address.street')
    .notEmpty()
    .withMessage('Street is required')
    .bail()
    .custom(isNotEmptyOrWhitespace)
    .withMessage('Street cannot contain only whitespace'),

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
