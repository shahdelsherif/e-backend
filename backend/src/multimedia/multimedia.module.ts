import { Module,forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Multimedia, MultimediaSchema } from './multimedia.schema';
import { MultimediaService } from './multimedia.service';
import { MultimediaController } from './multimedia.controller';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Multimedia.name, schema: MultimediaSchema }]),
  forwardRef(() => CoursesModule),],
  controllers: [MultimediaController],
  providers: [MultimediaService],
  exports: [MultimediaService],
})
export class MultimediaModule {}
