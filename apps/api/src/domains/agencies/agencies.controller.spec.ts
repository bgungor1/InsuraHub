import { Test, TestingModule } from '@nestjs/testing';
import { AgenciesController } from './agencies.controller';
import { AgenciesService } from './agencies.service';

describe('AgenciesController', () => {
  let controller: AgenciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgenciesController],
      providers: [
        {
          provide: AgenciesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AgenciesController>(AgenciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
