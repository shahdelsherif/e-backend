import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from './chat.schema';
import { CreateChatDto } from './create-chat.dto';
import { SendMessageDto } from './send-message.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  // Create a new chat
  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const newChat = new this.chatModel(createChatDto);
    return newChat.save();
  }

  // Send a new message in an existing chat
  async sendMessage(sendMessageDto: SendMessageDto): Promise<Chat> {
    const { chatId, senderId, message } = sendMessageDto;

    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    const newMessage = {
      senderId: new Types.ObjectId(senderId),
      message,
      timestamp: new Date(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    return chat; // Return the updated chat object with new messages
  }

  // Get all chats for a user
  async getChatsForUser(userId: string): Promise<Chat[]> {
    return this.chatModel.find({
      participants: new Types.ObjectId(userId),
    });
  }

  // Get messages of a specific chat
  async getMessages(chatId: string): Promise<any[]> {
    const chat = await this.chatModel
      .findById(chatId)
      .populate('messages.senderId', 'username'); // Populate sender's username
    if (!chat) {
      throw new Error('Chat not found');
    }
    return chat.messages;
  }
}
