import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './course.schema';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller'; 
import { MultimediaModule } from 'src/multimedia/multimedia.module';
import { QuizzesModule } from 'src/quizzes/quizzes.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),MultimediaModule, QuizzesModule],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [CoursesService],
})
export class CoursesModule {}
