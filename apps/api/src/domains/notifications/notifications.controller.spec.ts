import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { UserRole } from '@prisma/client';
import { QueryNotificationDto } from './dto';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  const mockService = {
    findAllForUser: jest.fn().mockResolvedValue({
      items: [],
      total: 0,
      unreadCount: 0,
    }),
    markAsRead: jest
      .fn()
      .mockResolvedValue({ id: 'notif_1', readAt: new Date() }),
    markAllAsRead: jest.fn().mockResolvedValue({ count: 5 }),
  };

  const mockUser = {
    userId: 'user_123',
    role: UserRole.BROKER,
    branchId: 'branch_abc',
    email: 'broker@insurahub.com',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [{ provide: NotificationsService, useValue: mockService }],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should call findAllForUser with current user id', async () => {
    const query = Object.assign(new QueryNotificationDto(), {
      page: 1,
      limit: 10,
    });
    await controller.findAll(query, mockUser);
    expect(mockService.findAllForUser).toHaveBeenCalledWith('user_123', query);
  });

  it('should call markAsRead with notification id and user id', async () => {
    await controller.markAsRead('notif_1', mockUser);
    expect(mockService.markAsRead).toHaveBeenCalledWith('notif_1', 'user_123');
  });

  it('should call markAllAsRead with user id', async () => {
    await controller.markAllAsRead(mockUser);
    expect(mockService.markAllAsRead).toHaveBeenCalledWith('user_123');
  });
});
