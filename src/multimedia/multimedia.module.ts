import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Multimedia, MultimediaSchema } from './multimedia.schema';
import { MultimediaService } from './multimedia.service';
import { MultimediaController } from './multimedia.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Multimedia.name, schema: MultimediaSchema }]),
  ],
  controllers: [MultimediaController],
  providers: [MultimediaService],
  exports: [MultimediaService],
})
export class MultimediaModule {}
