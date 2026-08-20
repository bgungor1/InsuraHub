import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryNotificationDto } from './dto';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockPrisma = {
    notification: {
      create: jest
        .fn()
        .mockImplementation(({ data }: { data: Record<string, unknown> }) => ({
          id: 'notif_1',
          ...data,
          readAt: null,
          createdAt: new Date(),
        })),
      findMany: jest
        .fn()
        .mockResolvedValue([
          { id: 'notif_1', title: 'Test Bildirim', readAt: null },
        ]),
      count: jest.fn().mockResolvedValue(1),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn().mockResolvedValue({ count: 2 }),
    },
  };

  const mockGateway = {
    sendNotificationToUser: jest.fn(),
    broadcast: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationsGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should create notification and emit to user via gateway', async () => {
    const result = await service.create({
      userId: 'user_123',
      type: 'TICKET_MESSAGE',
      title: 'Talebe Yanıt',
      message: 'Yanıt verildi.',
    });

    expect(result.id).toBe('notif_1');
    expect(mockGateway.sendNotificationToUser).toHaveBeenCalledWith(
      'user_123',
      expect.objectContaining({ title: 'Talebe Yanıt' }),
    );
  });

  it('should list notifications for user and return unread count', async () => {
    const query = Object.assign(new QueryNotificationDto(), {
      page: 1,
      limit: 10,
    });
    const result = await service.findAllForUser('user_123', query);

    expect(result.items).toHaveLength(1);
    expect(result.unreadCount).toBe(1);
  });

  it('should mark single notification as read', async () => {
    mockPrisma.notification.findFirst.mockResolvedValue({
      id: 'notif_1',
      userId: 'user_123',
    });
    mockPrisma.notification.update.mockResolvedValue({
      id: 'notif_1',
      readAt: new Date(),
    });

    const result = await service.markAsRead('notif_1', 'user_123');
    expect(result.readAt).toBeDefined();
  });

  it('should throw NotFoundException if notification does not exist or belong to user', async () => {
    mockPrisma.notification.findFirst.mockResolvedValue(null);

    await expect(service.markAsRead('invalid_id', 'user_123')).rejects.toThrow(
      NotFoundException,
    );
  });
});
