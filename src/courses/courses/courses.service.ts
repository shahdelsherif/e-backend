import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './course.schema';
import { promises } from 'dns';
import { MultimediaModule } from 'src/multimedia/multimedia.module';
import { MultimediaService } from 'src/multimedia/multimedia.service';
import { QuizzesService } from 'src/quizzes/quizzes.service';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>, private multimediaservice : MultimediaService,private quizzesservice : QuizzesService) {}


  async create(createCourseDto: Partial<Course>): Promise<Course> {
    const newCourse = new this.courseModel(createCourseDto);
    return newCourse.save(); 
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec(); 
  }

  async findMany(ids: string[]): Promise<Course[]> {
    return this.courseModel.find({ '_id': { $in: ids } }).exec();
  }

  async findManyByCriteria(criteria: any): Promise<Course[]> {
    return this.courseModel.find(criteria).exec(); 
  }

  async findOne(id: string): Promise<Course> {
    return this.courseModel.findById(id).exec(); 
  }

  async getOneByTitle(title_: string): Promise<Course | null> {
    const course = await this.courseModel.findOne({ title: title_ }).exec();
    if (!course) {
      throw new NotFoundException("Course not found");
    }
    return course;
  }

  async getMediaRates(courseId: string ): Promise <{title : string ; rate : number}[]>{
    const media = await this.multimediaservice.findByCourseId(courseId);
    const mediaRates = media.map((medium)=>({
      title : medium.title,
      rate : medium.rate
    }));
    return mediaRates;
  }


    getCalculateAverage(grades : Array<{studentID : number ; grade : number }>): number{
    if (grades.length === 0 ) {
      return 0;
    }
    const total = grades.reduce((sum ,  student ) => sum +student.grade , 0);
    const avg = total / grades.length;
    return avg;
  }

  async getAssesmentResult(courseID :string): Promise <{title : string ; AvgGrade : number} []>{
    const quizzes = await this.quizzesservice.getQuizzesByCourse(courseID);
    const quizResult= quizzes.map((quiz)=>({
      title : quiz.title,
      AvgGrade : this.getCalculateAverage(quiz.grades)
    }));
    return quizResult ;
  }
  


  async update(id: string, updateCourseDto: Partial<Course>): Promise<Course> {
    return this.courseModel.findByIdAndUpdate(id, updateCourseDto, { new: true }).exec(); // Update a course by ID
  }

  async remove(id: string): Promise<Course> {
    return this.courseModel.findByIdAndDelete(id).exec(); // Remove a course by ID
  }
}

