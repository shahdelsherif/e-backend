import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './course.schema';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller'; 
import { MultimediaModule } from 'src/multimedia/multimedia.module';
import { QuizzesModule } from 'src/quizzes/quizzes.module';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
  forwardRef(() => MultimediaModule), forwardRef(() => QuizzesModule), forwardRef(() => UsersModule)],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [CoursesService],
})
export class CoursesModule {}
