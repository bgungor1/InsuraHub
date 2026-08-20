import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePolicyDto } from '../dto';

export class PolicyCustomerHelper {
  static async resolveCustomerId(
    prisma: PrismaService,
    dto: CreatePolicyDto,
  ): Promise<string> {
    let resolvedCustomerId = dto.customerId;

    if (!resolvedCustomerId && dto.newCustomer) {
      let existingCustomer = await prisma.customer.findUnique({
        where: { identityNo: dto.newCustomer.identityNo },
      });
      if (!existingCustomer) {
        const { firstName, lastName, identityNo, ...contactFields } =
          dto.newCustomer;
        existingCustomer = await prisma.customer.create({
          data: {
            firstName,
            lastName,
            identityNo,
            contactInfo: contactFields,
          },
        });
      }
      resolvedCustomerId = existingCustomer.id;
    }

    if (!resolvedCustomerId) {
      throw new BadRequestException(
        'Müşteri seçilmeli veya yeni müşteri bilgileri girilmelidir.',
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id: resolvedCustomerId },
    });
    if (!customer) {
      throw new NotFoundException('Belirtilen müşteri bulunamadı.');
    }

    return resolvedCustomerId;
  }
}
