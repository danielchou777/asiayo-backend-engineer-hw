import { IValidationStrategy } from './iValidationStrategy.js';
import { Order } from '../../models/order.js';

export class PriceValidationStrategy implements IValidationStrategy {
  validate(order: Order): void {
    if (parseInt(order.price) < 0) {
      throw new Error('Price is less than 0');
    }

    if (parseFloat(order.price) > 2000) {
      throw new Error('Price is over 2000');
    }

    if (isNaN(parseInt(order.price)) === true) {
      throw new Error('Price is not a number');
    }
  }
}
