import { IValidationStrategy } from './iValidationStrategy.js';
import { Order } from '../../models/order.js';

export class CurrencyValidationStrategy implements IValidationStrategy {
  validate(order: Order): void {
    if (order.currency !== 'TWD' && order.currency !== 'USD') {
      throw new Error('Currency format is wrong');
    }
    if (order.currency === 'USD') {
      order.price = (parseFloat(order.price) * 31).toFixed(0);
      order.currency = 'TWD';
    }
  }
}
