import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { Chat, ChatSchema } from './chat.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]), UsersModule],
  providers: [ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
