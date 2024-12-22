import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Multimedia extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  courseId: string;

  @Prop({ default: ""})
  description: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  driveURL: string;
  

  @Prop({default:0})
  rate: number;


}

export const MultimediaSchema = SchemaFactory.createForClass(Multimedia);
