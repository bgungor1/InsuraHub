import { UserRole } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';

export class PolicyNotificationHelper {
  static async notifyOnPolicyCreated(
    prisma: PrismaService,
    notificationsService: NotificationsService,
    policy: {
      id: string;
      product: string;
      branchId: string;
      brokerId: string | null;
    },
    actorId: string,
  ) {
    await notificationsService.create({
      userId: actorId,
      type: 'POLICY_CREATED',
      title: 'Poliçe Başarıyla Oluşturuldu',
      message: `"${policy.product}" poliçesi sisteme kaydedildi ve şube havuzuna aktarıldı.`,
    });

    if (policy.brokerId && policy.brokerId !== actorId) {
      await notificationsService.create({
        userId: policy.brokerId,
        type: 'POLICY_ASSIGNED',
        title: 'Üzerinize Yeni Poliçe Atandı',
        message: `"${policy.product}" poliçesi üzerinize atandı.`,
      });
      return;
    }

    if (!policy.brokerId && policy.branchId) {
      const branchBrokers = await prisma.user.findMany({
        where: {
          branchId: policy.branchId,
          role: UserRole.BROKER,
          isActive: true,
        },
        select: { id: true },
      });

      for (const broker of branchBrokers) {
        if (broker.id !== actorId) {
          await notificationsService.create({
            userId: broker.id,
            type: 'POLICY_CREATED',
            title: 'Havuza Yeni Poliçe Eklendi',
            message: `Şubenizin havuzuna yeni bir "${policy.product}" poliçesi düştü.`,
          });
        }
      }
    }
  }

  static async notifyOnPolicyCompleted(
    notificationsService: NotificationsService,
    policy: { product: string; brokerId: string | null },
    totalAmount?: number,
  ) {
    if (policy.brokerId) {
      const amountStr = totalAmount
        ? `₺${totalAmount.toLocaleString('tr-TR')}`
        : '₺0';
      await notificationsService.create({
        userId: policy.brokerId,
        type: 'POLICY_COMPLETED',
        title: 'Poliçe Tanzim Edildi & Komisyon Hesaplandı',
        message: `"${policy.product}" poliçesi tamamlandı (Toplam Prim: ${amountStr}).`,
      });
    }
  }

  static async notifyOnPolicyReleased(
    prisma: PrismaService,
    notificationsService: NotificationsService,
    policy: { product: string; branchId: string },
    actorId: string,
  ) {
    const branchBrokers = await prisma.user.findMany({
      where: {
        branchId: policy.branchId,
        role: UserRole.BROKER,
        isActive: true,
      },
      select: { id: true },
    });

    for (const broker of branchBrokers) {
      if (broker.id !== actorId) {
        await notificationsService.create({
          userId: broker.id,
          type: 'POLICY_RELEASED',
          title: 'Poliçe Havuza Geri Bırakıldı',
          message: `"${policy.product}" poliçesi havuza geri bırakıldı, işleme alabilirsiniz.`,
        });
      }
    }
  }
}
