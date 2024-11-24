import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })  // Automatically adds createdAt and updatedAt fields
export class user {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: string;  // 'student', 'instructor', 'admin'

  @Prop()
  profilePicture: string;  // Updated to camelCase

  @Prop()
  createdAt: Date;  // Optional if timestamps is set to true (NestJS handles this automatically)

  @Prop()
  updatedAt: Date;  // Optional if timestamps is set to true (NestJS handles this automatically)

  @Prop()
  studentMetrics: {
    completionRate: number;
    averageScore: number;
    engagementTrends: string[];  // or any other type depending on the data format
  };
}
export const UserSchema = SchemaFactory.createForClass(user)
export type UserDocument = user & Document;


