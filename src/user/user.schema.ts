import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })  
export class user {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: string;  

  @Prop()
  profilePicture: string;  

  @Prop()
  createdAt: Date;  
  @Prop()
  updatedAt: Date;  

  @Prop()
  studentMetrics: {
    completionRate: number;
    averageScore: number;
    engagementTrends: string[];  
  };
}
export const UserSchema = SchemaFactory.createForClass(user)
export type UserDocument = user & Document;


