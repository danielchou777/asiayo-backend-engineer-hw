import { Order } from '../models/order.js';
import { IValidationStrategy } from './orderStrategies/iValidationStrategy.js';

export class OrderService {
  private validationStrategies: IValidationStrategy[];

  constructor(validationStrategies: IValidationStrategy[]) {
    this.validationStrategies = validationStrategies;
  }

  processOrder(orderData: Order): Order {
    for (const strategy of this.validationStrategies) {
      strategy.validate(orderData);
    }
    return orderData;
  }
}
