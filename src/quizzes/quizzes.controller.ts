import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { Quiz } from './quiz.schema';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  create(@Body() quizData: Partial<Quiz>) {
    return this.quizzesService.createQuiz(quizData);
  }

  @Get('course/:courseId')
  getQuizzesByCourse(@Param('courseId') courseId: string) {
    return this.quizzesService.getQuizzesByCourse(courseId);
  }

  @Get(':id')
  getQuizById(@Param('id') id: string) {
    return this.quizzesService.getQuizById(id);
  }

  @Put(':id')
  updateQuiz(@Param('id') id: string, @Body() quizData: Partial<Quiz>) {
    return this.quizzesService.updateQuiz(id, quizData);
  }

  @Delete(':id')
  deleteQuiz(@Param('id') id: string) {
    return this.quizzesService.deleteQuiz(id);
  }
}
