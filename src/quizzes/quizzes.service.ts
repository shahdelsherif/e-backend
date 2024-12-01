import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from './quiz.schema';

@Injectable()
export class QuizzesService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>) {}

  async createQuiz(quizData: Partial<Quiz>): Promise<Quiz> {
    const newQuiz = new this.quizModel(quizData);
    return newQuiz.save();
  }

  async getQuizzesByCourse(courseId: string): Promise<Quiz[]> {
    return this.quizModel.find({ courseId }).exec();
  }

  async getQuizById(id: string): Promise<Quiz> {
    const quiz = await this.quizModel.findById(id).exec();
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${id}" not found.`);
    }
    return quiz;
  }

  async updateQuiz(id: string, quizData: Partial<Quiz>): Promise<Quiz> {
    return this.quizModel.findByIdAndUpdate(id, quizData, { new: true }).exec();
  }

  async deleteQuiz(id: string): Promise<Quiz> {
    return this.quizModel.findByIdAndDelete(id).exec();
  }
}
