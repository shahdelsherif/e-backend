import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Questionnaire } from './questionnaire.schema';
import { CreateQuestionnaireDto } from './create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './update-questionnaire.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectModel(Questionnaire.name) private readonly questionnaireModel: Model<Questionnaire>, private readonly userService: UsersService,
  ) {}

 // Create a new questionnaire
 async createQuestionnaire(createQuestionnaireDto: CreateQuestionnaireDto): Promise<Questionnaire> {


    const studentId = createQuestionnaireDto.studentId;
    const student = await this.userService.findStudent(studentId);
    if (!student) {
      throw new NotFoundException("Student with this ID not found.");
    }
    
    createQuestionnaireDto.completionRate = student.studentMetrics.completionRate;
    createQuestionnaireDto.engagementTrends = student.studentMetrics.engagementTrends;
    createQuestionnaireDto.gpa = student.studentMetrics.averageScore;

    const newQuestionnaire = new this.questionnaireModel(createQuestionnaireDto);
    return newQuestionnaire.save();
  }

  // Get all questionnaires
  async findAll(): Promise<Questionnaire[]> {
    return this.questionnaireModel.find().exec();
  }

  // Get a specific questionnaire by ID
  async findOne(id: string): Promise<Questionnaire> {
    const questionnaire = await this.questionnaireModel.findById(id).exec();
    if (!questionnaire) {
      throw new NotFoundException(`Questionnaire with ID ${id} not found`);
    }
    return questionnaire;
  }

  async findByStudent(studentId: string): Promise<Questionnaire[]> {
    return this.questionnaireModel.find({ studentId }).exec();
  }

  // Update a specific questionnaire
  async updateQuestionnaire(id: string, updateQuestionnaireDto: UpdateQuestionnaireDto): Promise<Questionnaire> {
    const updatedQuestionnaire = await this.questionnaireModel
      .findByIdAndUpdate(id, updateQuestionnaireDto, { new: true, runValidators: true })
      .exec();
    if (!updatedQuestionnaire) {
      throw new NotFoundException(`Questionnaire with ID ${id} not found`);
    }
    return updatedQuestionnaire;
  }

  // Delete a specific questionnaire
  async deleteQuestionnaire(id: string): Promise<Questionnaire> {
    const deletedQuestionnaire = await this.questionnaireModel.findByIdAndDelete(id).exec();
    if (!deletedQuestionnaire) {
      throw new NotFoundException(`Questionnaire with ID ${id} not found`);
    }
    return deletedQuestionnaire;
  }
}