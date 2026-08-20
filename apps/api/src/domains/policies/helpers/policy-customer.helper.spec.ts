import { BadRequestException } from '@nestjs/common';
import { PolicyCustomerHelper } from './policy-customer.helper';
import { PrismaService } from '../../../prisma/prisma.service';

describe('PolicyCustomerHelper', () => {
  const mockCustomer = {
    findUnique: jest.fn(),
    create: jest.fn(),
  };

  const mockPrisma = {
    customer: mockCustomer,
  } as unknown as PrismaService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return customerId if customer exists', async () => {
    mockCustomer.findUnique.mockResolvedValue({
      id: 'cust-123',
    });

    const result = await PolicyCustomerHelper.resolveCustomerId(mockPrisma, {
      product: 'KASKO',
      customerId: 'cust-123',
    });

    expect(result).toBe('cust-123');
  });

  it('should throw BadRequestException if neither customerId nor newCustomer is provided', async () => {
    await expect(
      PolicyCustomerHelper.resolveCustomerId(mockPrisma, {
        product: 'KASKO',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create new customer and return id if newCustomer is provided and does not exist', async () => {
    mockCustomer.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'new-cust-id' });
    mockCustomer.create.mockResolvedValue({
      id: 'new-cust-id',
    });

    const result = await PolicyCustomerHelper.resolveCustomerId(mockPrisma, {
      product: 'KASKO',
      newCustomer: {
        firstName: 'Ali',
        lastName: 'Veli',
        identityNo: '12345678901',
        city: 'Ankara',
      },
    });

    expect(result).toBe('new-cust-id');
    expect(mockCustomer.create).toHaveBeenCalled();
  });
});
