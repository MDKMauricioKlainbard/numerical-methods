import { Test, TestingModule } from '@nestjs/testing';
import { FunctionRootsController } from './function-roots.controller';

describe('FunctionRootsController', () => {
  let controller: FunctionRootsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FunctionRootsController],
    }).compile();

    controller = module.get<FunctionRootsController>(FunctionRootsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
