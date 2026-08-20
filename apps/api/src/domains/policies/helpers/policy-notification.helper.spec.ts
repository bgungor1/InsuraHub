import { PolicyNotificationHelper } from './policy-notification.helper';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';

describe('PolicyNotificationHelper', () => {
  const mockUser = {
    findMany: jest
      .fn()
      .mockResolvedValue([{ id: 'broker_1' }, { id: 'broker_2' }]),
  };

  const mockPrisma = {
    user: mockUser,
  } as unknown as PrismaService;

  const mockNotificationCreate = jest.fn().mockResolvedValue({ id: 'notif_1' });

  const mockNotificationsService = {
    create: mockNotificationCreate,
  } as unknown as NotificationsService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should notify creator and assigned broker when brokerId is defined on policy creation', async () => {
    await PolicyNotificationHelper.notifyOnPolicyCreated(
      mockPrisma,
      mockNotificationsService,
      {
        id: 'pol_1',
        product: 'Kasko',
        branchId: 'branch_1',
        brokerId: 'broker_1',
      },
      'admin_1',
    );

    expect(mockNotificationCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'admin_1',
        title: 'Poliçe Başarıyla Oluşturuldu',
      }),
    );

    expect(mockNotificationCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'broker_1',
        type: 'POLICY_ASSIGNED',
        title: 'Üzerinize Yeni Poliçe Atandı',
      }),
    );
  });

  it('should notify creator and all active branch brokers when an unassigned policy is added to pool', async () => {
    await PolicyNotificationHelper.notifyOnPolicyCreated(
      mockPrisma,
      mockNotificationsService,
      {
        id: 'pol_1',
        product: 'Trafik',
        branchId: 'branch_1',
        brokerId: null,
      },
      'admin_1',
    );

    expect(mockNotificationCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'admin_1',
        title: 'Poliçe Başarıyla Oluşturuldu',
      }),
    );

    expect(mockNotificationCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'broker_1',
        type: 'POLICY_CREATED',
      }),
    );
  });

  it('should notify broker when policy is completed with commission', async () => {
    await PolicyNotificationHelper.notifyOnPolicyCompleted(
      mockNotificationsService,
      { product: 'Kasko', brokerId: 'broker_1' },
      15000,
    );

    expect(mockNotificationCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'broker_1',
        type: 'POLICY_COMPLETED',
      }),
    );
  });
});
