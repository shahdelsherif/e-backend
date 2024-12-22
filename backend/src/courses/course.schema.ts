import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) 
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ type: String, required: true })
  instructorId: string; 

  @Prop({ type: String, required: true })
  instructorName: string; 

  @Prop({ type: [String], default: [] }) 
  studentsEnrolled: string[];
  

  @Prop({ type: [String], default: [] }) 
  multimediaIds: string[];

  @Prop({ type: [String], default: [] }) 
  quizzesIds: string[];

  @Prop({default: "false" })
  completed: string; 

}

export const CourseSchema = SchemaFactory.createForClass(Course);
