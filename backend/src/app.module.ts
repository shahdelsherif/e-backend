import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { MultimediaModule } from './multimedia/multimedia.module';
import { QuizzesModule } from './quizzes/quizzes.module';
//import { MiddlewareConsumer, NestModule } from '@nestjs/common';
//import { AuthenticateMiddleware } from './middleware/authenticate.middleware';
import { BackupService } from './backup/backup.service';
import { ChatsModule } from './chats/chats.module';
import { ForumsModule } from './forums/forums.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [ MongooseModule.forRoot('mongodb://localhost:27017/Elearning'),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'kjhkjh#fhfgf@jk',
      signOptions: { expiresIn: '1h' }, 
    }),

    UsersModule,
    CoursesModule,
    MultimediaModule,
    QuizzesModule,
    ChatsModule,
    ForumsModule,
    NotificationsModule,
    QuestionnaireModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService, BackupService],
 
})
/*export class AppModule{}*/

export class AppModule {
//  configure(consumer: MiddlewareConsumer) {
//    consumer.apply(AuthenticateMiddleware).forRoutes('*'); // Applies globally
//  }
}
