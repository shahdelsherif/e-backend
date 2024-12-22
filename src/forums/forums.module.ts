import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';
import { Forum, ForumSchema } from './forum.schema';
import { CoursesModule } from 'src/courses/courses.module';
import { NotificationsModule } from '../notifications/notifications.module'; 

@Module({
  imports: [MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }]),
  CoursesModule,
NotificationsModule],
  providers: [ForumsService],
  controllers: [ForumsController],
})
export class ForumsModule {}
