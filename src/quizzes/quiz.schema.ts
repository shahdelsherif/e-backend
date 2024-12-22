import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Quiz extends Document {
  @Prop({ required: true })
  courseId: string; // Reference to a course

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop([{
    question: String,
    options: [String],
    correctAnswer: String,
    difficulty : Number,
  }])
  questions: Array<{ question: string; options: string[]; correctAnswer: string ; difficulty : number }>;

  @Prop([{studentID: Number, grade: Number}])
  grades: Array<{studentID: number; grade: number}>;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

