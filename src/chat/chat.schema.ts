import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chat {
  @Prop([{
    type: Types.ObjectId,
    ref: 'User'
  }])
  participants: Types.ObjectId[];

  @Prop([{
    senderId: { type: Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }])
  messages: Array<{
    senderId: Types.ObjectId;
    message: string;
    timestamp: Date;
  }>;

  @Prop({ default: false })
  isGroupChat: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

export type ChatDocument = Chat & Document;
