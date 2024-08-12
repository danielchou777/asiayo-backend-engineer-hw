import { Request, Response } from 'express';
import { OrderService } from '../services/orderService.js';
import {
  NameValidationStrategy,
  PriceValidationStrategy,
  CurrencyValidationStrategy,
} from '../services/orderStrategies/index.js';

export const createOrder = (req: Request, res: Response) => {
  const validationStrategies = [
    new NameValidationStrategy(),
    new PriceValidationStrategy(),
    new CurrencyValidationStrategy(),
  ];

  const orderService = new OrderService(validationStrategies);

  try {
    const result = orderService.processOrder(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Unknown error occurred' });
    }
  }
};
