import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Forum extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  topic: string;

  @Prop({
    type: [
      {
        _id: { type: Types.ObjectId, required: true },
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        replies: [
          {
            userId: { type: Types.ObjectId, ref: 'User', required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    default: [],
  })
  posts: Array<{
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    content: string;
    timestamp: Date;
  replies: Array<{
    userId: Types.ObjectId;
    content: string;
    timestamp: Date;
    }>;
  }>;
}

export const ForumSchema = SchemaFactory.createForClass(Forum);

// Add a compound text index for search
ForumSchema.index({
  topic: 'text',
  'posts.content': 'text', 
  'replies.content': 'text'
});

