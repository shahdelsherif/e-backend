import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from './chat.schema';
import { CreateChatDto } from './create-chat.dto';
import { SendMessageDto } from './send-message.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>, private readonly userService:UsersService) {}

  // create a new chat
  async createChat(createChatDto: CreateChatDto): Promise<Chat> {

    let participants = createChatDto.participants;
    let participants_numbers = []
    for (let i = 0; i < participants.length; i++)
      participants_numbers.push(Number(participants[i]));

    participants = await this.userService.getDB_ids(participants_numbers);

    participants.push(createChatDto.creator);

    const newChatData = {
      chatName: createChatDto.chatName,
      participants,
      isGroupChat: createChatDto.isGroupChat,
    };

    const newChat = new this.chatModel(newChatData);
    return newChat.save();
  }

  // send a new message
  async sendMessage(sendMessageDto: SendMessageDto): Promise<Chat> {
    const { chatId, senderId, message } = sendMessageDto;

    const chat = await this.chatModel.findById(chatId);

    if (!chat) {
      throw new Error('Chat not found');
    }

    const user = await this.userService.findOne(senderId);


    const newMessage = {
      senderId: new Types.ObjectId(senderId),
      senderName: user.name,
      message: message,
      timestamp: new Date(),
    };

    chat.messages.push(newMessage);

    await chat.save();
    return chat; 
  }

  // get all chats
  async getChatsForUser(userId: string): Promise<Chat[]> {
    
    const chats = await this.chatModel.find({participants:{ $in: [userId] } }).exec();

    return chats;
  }

  // get messages
  async getMessages(chatId: string): Promise<any[]> {

  console.log("hi");
    const chat = await this.chatModel
      .findById(chatId)
      .populate('messages.senderId', 'username');
    if (!chat) {
      throw new Error('Chat not found');
    }
    return chat.messages;
  }
}
