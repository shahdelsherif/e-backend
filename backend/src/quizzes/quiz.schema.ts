import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Question {
  @Prop({ required: true })
  question: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ required: true })
  difficulty: number; // from 1 to 5 -> 1 for easy and 5 for difficult 

}

class grades{
  @Prop()
  studentId: number;

  @Prop()
  grade: number;
}

@Schema({ timestamps: true })
export class Quiz extends Document {
  @Prop({ required: true })
  courseId: string; // Reference to a course

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  numOfQuestions: number;

  @Prop({ default: 'Available' })
  status: string;

  @Prop({ type: [Question], required: true })
  easyQuestions: Question[];

  @Prop({ type: [Question], required: true })
  mediumQuestions: Question[];

  @Prop({ type: [Question], required: true })
  hardQuestions: Question[];

  @Prop({type: [grades]})
  grades: grades[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
