import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Multimedia } from './multimedia.schema';

@Injectable()
export class MultimediaService {
  constructor(@InjectModel(Multimedia.name) private multimediaModel: Model<Multimedia>) {}

  async create(multimediaData: Partial<Multimedia>): Promise<Multimedia> {
    const newMultimedia = new this.multimediaModel(multimediaData);
    return newMultimedia.save();
  }

  async findAll(): Promise<Multimedia[]> {
    return this.multimediaModel.find().exec();
  }

  async findByCourseId(courseId: string): Promise<Multimedia[]> {
    return this.multimediaModel.find({ courseId }).exec();
  }

  async findOne(id: string): Promise<Multimedia> {
    const multimedia = await this.multimediaModel.findById(id).exec();
    if (!multimedia) {
      throw new NotFoundException('Multimedia not found');
    }
    return multimedia;
  }

  async update(id: string, multimediaData: Partial<Multimedia>): Promise<Multimedia> {
    const updatedMultimedia = await this.multimediaModel
      .findByIdAndUpdate(id, multimediaData, { new: true })
      .exec();
    if (!updatedMultimedia) {
      throw new NotFoundException('Multimedia not found');
    }
    return updatedMultimedia;
  }

  async delete(id: string): Promise<Multimedia> {
    const deletedMultimedia = await this.multimediaModel.findByIdAndDelete(id).exec();
    if (!deletedMultimedia) {
      throw new NotFoundException('Multimedia not found');
    }
    return deletedMultimedia;
  }
}
