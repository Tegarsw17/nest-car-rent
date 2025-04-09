import { Test, TestingModule } from '@nestjs/testing';
import { AdminCarService } from './admin-car.service';

describe('AdminCarService', () => {
  let service: AdminCarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminCarService],
    }).compile();

    service = module.get<AdminCarService>(AdminCarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
