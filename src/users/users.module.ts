import { MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './user.schema';
import { JwtStrategy } from './jwt.strategy';
import { CoursesModule } from 'src/courses/courses.module';
import { AuthenticateMiddleware } from '../middleware/authenticate.middleware';
import { createRoleMiddleware } from '../middleware/role.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtStrategy,
    CoursesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
/*export class UsersModule{}*/

export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .forRoutes(UsersController); // Apply authentication middleware

    consumer
    .apply(createRoleMiddleware(['admin', 'instructor']))
      .forRoutes('users/admin'); // Apply role-based middleware for specific routes
  }
}