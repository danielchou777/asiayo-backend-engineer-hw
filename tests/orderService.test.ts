import { OrderService } from '../src/services/orderService';
import { Order } from '../src/models/order';

describe('OrderService', () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
  });

  // Successful Cases
  it('should process a valid TWD order successfully', () => {
    const order: Order = {
      id: 'A0000001',
      name: 'Melody Holiday Inn',
      address: {
        city: 'taipei-city',
        district: 'da-an-district',
        street: 'fuxing-south-road',
      },
      price: '1500',
      currency: 'TWD',
    };
    const result = orderService.processOrder(order);
    expect(result).toEqual(order);
  });

  it('should convert and process a valid USD order successfully', () => {
    const order: Order = {
      id: 'A0000002',
      name: 'Melody Holiday Inn',
      address: {
        city: 'taipei-city',
        district: 'da-an-district',
        street: 'fuxing-south-road',
      },
      price: '100',
      currency: 'USD',
    };
    const result = orderService.processOrder(order);
    expect(result.price).toBe('3100');
    expect(result.currency).toBe('TWD');
  });

  // Failed Cases
  // Name field errors
  it('should throw an error if name contains non-English characters', () => {
    const order: Order = {
      id: 'A0000003',
      name: '美樂蒂',
      address: {
        city: 'taipei-city',
        district: 'da-an-district',
        street: 'fuxing-south-road',
      },
      price: '1500',
      currency: 'TWD',
    };
    expect(() => orderService.processOrder(order)).toThrow(
      'Name contains non-English characters'
    );
  });

  it('should throw an error if the name is not capitalized', () => {
    const order: Order = {
      id: 'A0000006',
      name: 'melody Holiday Inn',
      address: {
        city: 'taipei-city',
        district: 'da-an-district',
        street: 'fuxing-south-road',
      },
      price: '1500',
      currency: 'TWD',
    };
    expect(() => orderService.processOrder(order)).toThrow(
      'Name is not capitalized'
    );
  });

  // Price field errors
  it('should throw an error if price is not a number', () => {
    const order: Order = {
      id: 'A0000004',
      name: 'Melody Holiday Inn',
      address: {
        city: 'taipei-city',
        district: 'da-an-district',
        street: 'fuxing-south-road',
      },
      price: '一千五百',
      currency: 'TWD',
    };
    expect(() => orderService.processOrder(order)).toThrow(
      'Price is not a number'
    );
  });

  it('should throw an error if price exceeds 2000', () => {
    const order: Order = {
      id: 'A0000004',
      name: 'Melody Holiday Inn',
      address: {
        city: 'taipei-city',
        district: 'da-an-district',
        street: 'fuxing-south-road',
      },
      price: '2500',
      currency: 'TWD',
    };
    expect(() => orderService.processOrder(order)).toThrow(
      'Price is over 2000'
    );
  });

  it('should throw an error if price is less than 0', () => {
    const order: Order = {
      id: 'A0000005',
      name: 'Melody Holiday Inn',
      address: {
        city: 'taipei-city',
        district: 'da-an-district',
        street: 'fuxing-south-road',
      },
      price: '-1',
      currency: 'TWD',
    };
    expect(() => orderService.processOrder(order)).toThrow(
      'Price is less than 0'
    );
  });

  // Currency field errors
  it('should throw an error if currency is neither TWD nor USD', () => {
    const order: Order = {
      id: 'A0000005',
      name: 'Melody Holiday Inn',
      address: {
        city: 'taipei-city',
        district: 'da-an-district',
        street: 'fuxing-south-road',
      },
      price: '1500',
      currency: 'EUR',
    };
    expect(() => orderService.processOrder(order)).toThrow(
      'Currency format is wrong'
    );
  });
});
