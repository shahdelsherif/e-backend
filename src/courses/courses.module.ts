import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  providers: [CoursesService],
  controllers: [CoursesController]
})
export class CoursesModule {}
