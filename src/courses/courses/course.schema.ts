import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true }) 
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  /*@Prop({ required: true })
  ID: number;*/

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, required: true })
  instructorId: string; 

  /*@Prop({ type: [String], default: [] }) 
  studentsEnrolled: string[];

  @Prop({ type: [String], default: [] }) 
  multimediaIds: string[];*/

  @Prop({ type: [String], default: []}) 
  studentsEnrolled: string;  
  

  @Prop({ type: [mongoose.Schema.Types.ObjectId]}) 
  multimediaIds: mongoose.Types.ObjectId[];  

  @Prop({default: false })
  completed: boolean; 


}

export const CourseSchema = SchemaFactory.createForClass(Course);
