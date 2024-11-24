import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Multimedia {
  @Prop({ type: Types.ObjectId, ref: 'Course' })
  courseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  uploadedBy: Types.ObjectId;

  @Prop()
  type: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  url: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

export const MultimediaSchema = SchemaFactory.createForClass(Multimedia);

export type MultimediaDocument = Multimedia & Document;
