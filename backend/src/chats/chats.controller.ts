import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './create-chat.dto';
import { SendMessageDto } from './send-message.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  // Create a new chat
  @Post('create')
  async createChat(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.createChat(createChatDto);
  }

  // Send a message in a chat
  @Post('send-message')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.chatsService.sendMessage(sendMessageDto);
  }

  // Get all chats for a user
  @Get('user/:userId')
  async getChatsForUser(@Param('userId') userId: string) {
    return this.chatsService.getChatsForUser(userId);
  }

  // Get all messages for a specific chat
  @Get('chat/:chatId')
  async getMessages(@Param('chatId') chatId: string) {
    return this.chatsService.getMessages(chatId);
  }
}
