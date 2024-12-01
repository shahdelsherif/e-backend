import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { Questionnaire } from './questionnaire.schema';
import { CreateQuestionnaireDto } from './create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './update-questionnaire.dto';

@Controller('questionnaires')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  
  @Post('/create')
  create(@Body() createQuestionnaireDto: CreateQuestionnaireDto) {
    return this.questionnaireService.createQuestionnaire(createQuestionnaireDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateQuestionnaireDto: UpdateQuestionnaireDto) {
    return this.questionnaireService.updateQuestionnaire(id, updateQuestionnaireDto);
  }


  @Get('student/:studentId')
  async findByStudent(@Param('studentId') courseId: string): Promise<Questionnaire[]> {
    return this.questionnaireService.findByStudent(courseId);
  }


  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Questionnaire> {
    return this.questionnaireService.deleteQuestionnaire(id);
  }
}
