import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Form {
  @Prop({ type: Types.ObjectId, ref: 'Course' })
  courseId: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  type: string;

  @Prop([
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ])
  questions: { question: string; options: string[]; correctAnswer: string }[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const FormSchema = SchemaFactory.createForClass(Form);

export type FormDocument = Form & Document;
