import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'student' })
  role: string;

  @Prop({ required: true })
  ID: number;

  @Prop({ type: String, default: '' })
  profilePicture: string; // img.png

  @Prop({
    type: Object,
    default: {
      completionRate: 0,
      averageScore: 0,
      engagementTrends: "",
    },
  })
  studentMetrics: {
    completionRate: number;
    averageScore: number;
    engagementTrends: string;
  };

  @Prop([mongoose.Schema.Types.ObjectId])  // Array of ObjectIds for courses
  enrolledCourses: mongoose.Types.ObjectId[];

  @Prop([{courseTitle: String , score: Number}])  
  enrolledCoursesScores: Array<{courseName: string ; score: number}>;

}

export const UserSchema = SchemaFactory.createForClass(User);
