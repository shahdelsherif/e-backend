import { Module } from '@nestjs/common';
import { MultiMediaController } from './multi-media.controller';
import { MultiMediaService } from './multi-media.service';

@Module({
  controllers: [MultiMediaController],
  providers: [MultiMediaService]
})
export class MultiMediaModule {}
