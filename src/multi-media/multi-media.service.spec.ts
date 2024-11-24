import { Test, TestingModule } from '@nestjs/testing';
import { MultiMediaService } from './multi-media.service';

describe('MultiMediaService', () => {
  let service: MultiMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MultiMediaService],
    }).compile();

    service = module.get<MultiMediaService>(MultiMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
