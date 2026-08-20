import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TicketStatus, UserRole } from '@prisma/client';

describe('TicketsService', () => {
  let service: TicketsService;

  const mockAdminUser = {
    userId: 'admin_1',
    role: UserRole.SUPERADMIN,
    email: 'admin@insurahub.com',
  };

  const mockBrokerUser = {
    userId: 'broker_1',
    role: UserRole.BROKER,
    branchId: 'branch_1',
    email: 'broker@insurahub.com',
  };

  const mockPrisma = {
    ticket: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    ticketMessage: {
      create: jest.fn(),
    },
  };

  const mockNotificationsService = {
    create: jest.fn().mockResolvedValue({ id: 'notif_1' }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should notify the ticket creator when a manager/admin replies to their ticket', async () => {
    mockPrisma.ticket.findUnique.mockResolvedValue({
      id: 'ticket_1',
      subject: 'Komisyon Hak Ediş Sorunu',
      creatorId: 'broker_1',
      status: TicketStatus.OPEN,
      creator: { branch: null, agency: null },
      messages: [],
    });

    mockPrisma.ticketMessage.create.mockResolvedValue({
      id: 'msg_1',
      ticketId: 'ticket_1',
      senderId: 'admin_1',
      body: 'Talep incelendi ve çözüldü.',
      sender: {
        id: 'admin_1',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.SUPERADMIN,
      },
    });

    mockPrisma.ticket.update.mockResolvedValue({
      id: 'ticket_1',
      status: TicketStatus.IN_PROGRESS,
    });

    await service.addMessage(
      'ticket_1',
      { body: 'Talep incelendi ve çözüldü.' },
      mockAdminUser,
    );

    expect(mockNotificationsService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'broker_1',
        type: 'TICKET_MESSAGE',
        title: 'Destek Talebinize Yanıt Verildi',
      }),
    );
  });

  it('should NOT notify when the ticket creator writes a message to their own ticket', async () => {
    mockPrisma.ticket.findUnique.mockResolvedValue({
      id: 'ticket_1',
      subject: 'Sorun Detayı',
      creatorId: 'broker_1',
      status: TicketStatus.OPEN,
      creator: { branch: null, agency: null },
      messages: [],
    });

    mockPrisma.ticketMessage.create.mockResolvedValue({
      id: 'msg_2',
      ticketId: 'ticket_1',
      senderId: 'broker_1',
      body: 'Ek dosya ekliyorum.',
      sender: {
        id: 'broker_1',
        firstName: 'Broker',
        lastName: 'User',
        role: UserRole.BROKER,
      },
    });

    await service.addMessage(
      'ticket_1',
      { body: 'Ek dosya ekliyorum.' },
      mockBrokerUser,
    );

    expect(mockNotificationsService.create).not.toHaveBeenCalled();
  });
});
