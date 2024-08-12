import { IValidationStrategy } from './iValidationStrategy.js';
import { Order } from '../../models/order.js';

export class NameValidationStrategy implements IValidationStrategy {
  validate(order: Order): void {
    if (/[^a-zA-Z\s]/.test(order.name)) {
      throw new Error('Name contains non-English characters');
    }

    if (order.name.charAt(0) !== order.name.charAt(0).toUpperCase()) {
      throw new Error('Name is not capitalized');
    }
  }
}
