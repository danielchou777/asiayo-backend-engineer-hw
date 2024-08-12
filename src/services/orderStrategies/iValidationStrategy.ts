import { Order } from '../../models/order.js';

export interface IValidationStrategy {
  validate(order: Order): void;
}
