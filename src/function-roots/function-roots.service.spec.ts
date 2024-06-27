import { Test, TestingModule } from '@nestjs/testing';
import { FunctionRootsService } from './function-roots.service';

describe('FunctionRootsService', () => {
  let service: FunctionRootsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunctionRootsService],
    }).compile();

    service = module.get<FunctionRootsService>(FunctionRootsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
