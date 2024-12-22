import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';


class scores {
  @Prop({})
  courseId: string;
  @Prop({})
  score: number;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    type: String, 
    enum: ['student', 'admin', 'instructor'], 
    default: 'student' 
  })
  role: string;

  @Prop({ required: true })
  ID: number;

  @Prop({ type: String, default: '' })
  profilePicture: string;

  @Prop({
    type: Object,
    default: {
      completionRate: 0,
      averageScore: 0,
      engagementTrend: "Low",
    },
  })
  studentMetrics: {
    completionRate: number;
    averageScore: number;
    engagementTrends: string;
  };

  @Prop({ type: [String], default: [] })  
  enrolledCourses: string[];

  @Prop({type: [scores]})  
  enrolledCoursesScores: scores[];

}

export const UserSchema = SchemaFactory.createForClass(User);
