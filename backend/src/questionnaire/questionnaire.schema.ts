import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Questionnaire extends Document {

  @Prop({ type: Number, ref: 'User', required: true })
  studentId: number;

  @Prop({ type: String, required: true })
  department: string;

  @Prop({ type: String, required: true })
  preferredCourse: string;

  @Prop({ type: String, required: true }) // Assuming grade is a letter
  grade: string;

  @Prop({ type: String, required: true }) // Could be 'completed', 'in-progress', etc.
  completionStatus: string;

  @Prop({ type: String, enum: ['yes', 'no'], required: true })
  progPreferred: string;

  @Prop({ type: String, enum: ['yes', 'no'], required: true })
  mathPreferred: string;

  @Prop({ type: Number}) // Assuming GPA is numeric
  gpa: number;

  @Prop({ type: String, enum: ['Low', 'Medium', 'High']})
  engagementTrends: string;

  @Prop({ type: Number}) // Completion rate as a percentage
  completionRate: number;

  @Prop({type: String,})
  recommendedGroup: string;
}

export const QuestionnaireSchema = SchemaFactory.createForClass(Questionnaire);
