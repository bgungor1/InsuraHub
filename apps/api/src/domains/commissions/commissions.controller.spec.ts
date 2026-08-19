import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsController } from './commissions.controller';
import { CommissionsService } from './commissions.service';

describe('CommissionsController', () => {
  let controller: CommissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommissionsController],
      providers: [
        {
          provide: CommissionsService,
          useValue: {
            createRule: jest.fn(),
            getActiveRules: jest.fn(),
            getAllRules: jest.fn(),
            findAllSnapshots: jest.fn(),
            findSnapshotByPolicyId: jest.fn(),
            calculateAndSnapshot: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommissionsController>(CommissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
