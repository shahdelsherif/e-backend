import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { CoursesModule } from './courses/courses.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { FormsModule } from './forms/forms.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportModule } from './report/report.module';
import { ChatModule } from './chat/chat.module';
import { MultiMediaModule } from './multi-media/multi-media.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/schema'), CoursesModule, QuizzesModule, FormsModule, NotificationsModule, ReportModule, ChatModule, MultiMediaModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
.

