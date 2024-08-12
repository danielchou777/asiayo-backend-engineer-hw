import { Order } from '../models/order.js';

export class OrderService {
  processOrder(orderData: Order): Order {
    if (/[^a-zA-Z\s]/.test(orderData.name)) {
      throw new Error('Name contains non-English characters');
    }

    if (orderData.name.charAt(0) !== orderData.name.charAt(0).toUpperCase()) {
      throw new Error('Name is not capitalized');
    }

    if (isNaN(parseInt(orderData.price)) === true) {
      throw new Error('Price is not a number');
    }

    if (parseInt(orderData.price) > 2000) {
      throw new Error('Price is over 2000');
    }

    if (parseInt(orderData.price) < 0) {
      throw new Error('Price is less than 0');
    }

    if (orderData.currency !== 'TWD' && orderData.currency !== 'USD') {
      throw new Error('Currency format is wrong');
    }

    if (orderData.currency === 'USD') {
      orderData.price = (parseFloat(orderData.price) * 31).toFixed(0);
      orderData.currency = 'TWD';
    }

    return orderData;
  }
}
