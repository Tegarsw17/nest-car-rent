import { Test, TestingModule } from '@nestjs/testing';
import { AdminCarController } from './admin-car.controller';

describe('AdminCarController', () => {
  let controller: AdminCarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminCarController],
    }).compile();

    controller = module.get<AdminCarController>(AdminCarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
