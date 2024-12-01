import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the Chat schema
@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: true,
  })
  participants: Types.ObjectId[];

  @Prop({
    type: [
      {
        senderId: { type: Types.ObjectId, ref: 'User' },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  })
  messages: Array<{
    senderId: Types.ObjectId;
    message: string;
    timestamp: Date;
  }>;

  @Prop({ default: false })
  isGroupChat: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
