import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from './quiz.schema';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class QuizzesService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>, @Inject(forwardRef(() => CoursesService)) private courseService:CoursesService) {}

  async createQuiz(quizData: Partial<Quiz>): Promise<Quiz> {
    const newQuiz = new this.quizModel(quizData);
    newQuiz.save();

    this.courseService.addQuiz(newQuiz._id.toString(), quizData.courseId);
    return newQuiz;
  }

  async submitGrade(id: string, studentId: number, grade: number): Promise<any> {
    const quiz = await this.quizModel.findById(id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    quiz.grades.push({
      studentId: studentId,
      grade: grade,
    });

    // Save the updated quiz
    await quiz.save();

    return { message: 'Grade submitted successfully' };
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
