import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Course {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Instructor' })
  instructorId: Types.ObjectId;

  @Prop([Types.ObjectId])
  studentsEnrolled: Types.ObjectId[];

  @Prop([Types.ObjectId])
  multimediaIds: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

export type CourseDocument = Course & Document;
