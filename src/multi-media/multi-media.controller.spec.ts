import { Test, TestingModule } from '@nestjs/testing';
import { MultiMediaController } from './multi-media.controller';

describe('MultiMediaController', () => {
  let controller: MultiMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MultiMediaController],
    }).compile();

    controller = module.get<MultiMediaController>(MultiMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
