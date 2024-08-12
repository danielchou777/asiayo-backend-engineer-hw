import { validateOrderFields } from '../src/middlewares/orderValidationMiddleware';
import { Request, Response, NextFunction } from 'express';

describe('ValidationMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {
        id: 'A0000001',
        name: 'Melody Holiday Inn',
        address: {
          city: 'taipei-city',
          district: 'da-an-district',
          street: 'fuxing-south-road',
        },
        price: '1500',
        currency: 'TWD',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  async function executeMiddleware() {
    for (let mw of validateOrderFields) {
      await (mw as Function)(req, res, next);
    }
  }

  // Successful Case
  it('should pass validation with correct data', async () => {
    await executeMiddleware();

    expect(next).toHaveBeenCalled();
  });

  // Failed Cases
  it('should return 400 if a required field is missing', async () => {
    delete req.body!.name;

    await executeMiddleware();

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it('should return 400 if address is missing a field', async () => {
    delete req.body!.address!.street;

    await executeMiddleware();

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });
});
