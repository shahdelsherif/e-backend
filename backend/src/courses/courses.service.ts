import { Injectable, NotFoundException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './course.schema';
import { UsersService } from 'src/users/users.service';
import { MultimediaService } from 'src/multimedia/multimedia.service';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { error } from 'console';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>,@Inject(forwardRef(() => MultimediaService))  private multimediaService: MultimediaService,@Inject(forwardRef(() => QuizzesService)) private quizzesService: QuizzesService, @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService) {}

  async create(createCourseDto: Partial<Course>): Promise<Course> {
    const newCourse = new this.courseModel(createCourseDto);
    return newCourse.save(); 
  }

  async enrollStudent(courseId: string, userId: string): Promise<void> {

    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the user is already enrolled
    const alreadyEnrolled = user.enrolledCourses.some((course_id) => course_id.toString() === course.id);
    if (alreadyEnrolled) {
      throw new BadRequestException('User is already enrolled in this course');
    }

    // add course to student list
    user.enrolledCourses.push(course.id);
    await this.usersService.update(userId,user);

    // add student to course list
    course.studentsEnrolled.push(userId);
    await this.courseModel.findByIdAndUpdate(courseId, course, { new: true }).exec();
  }

  async findOne(id: string): Promise<Course> {
    return this.courseModel.findById(id).exec(); 
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

  async getOneByTitle(title_: string): Promise<Course | null> {
    const course = await this.courseModel.findOne({ title: title_ }).exec();
    if (!course) {
      throw new NotFoundException("Course with this title not found.");
    }
    return course;
  }

  async getMediaRates(courseId: string):Promise<{title:string; rate:number}[]>{

    const media = await this.multimediaService.findByCourseId(courseId);
    const mediaRates = media.map((medium)=>({
      title: medium.title,
      rate: medium.rate
    }));

    return mediaRates;
  }

  calculateAverage(grades: any): number{
    
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, student) => sum + student.grade, 0);
    return total / grades.length;
  }

  async getAssesmentsResults(courseId: string):Promise<{title:string; avgGrade:number}[]>{

    const quizzes = await this.quizzesService.getQuizzesByCourse(courseId);
    const quizzesResults = quizzes.map((quiz)=>({
      title: quiz.title,
      avgGrade: this.calculateAverage(quiz.grades)
    }));

    return quizzesResults;
  }

  async update(id: string, updateCourseDto: Partial<Course>): Promise<Course> {
    return this.courseModel.findByIdAndUpdate(id, updateCourseDto, { new: true }).exec(); // Update a course by ID
  }

  async remove(id: string): Promise<Course> {
    return this.courseModel.findByIdAndDelete(id).exec(); // Remove a course by ID
  }

  async addMaterials(mat_id:string, course_id:string ){

    console.log(mat_id, course_id);

    var course = this.courseModel.findById(course_id).exec();
    (await course).multimediaIds.push(mat_id);
    (await course).save();
  }

  async addQuiz(quiz_id:string, course_id:string ){

    console.log(quiz_id, course_id);

    var course = this.courseModel.findById(course_id).exec();
    (await course).quizzesIds.push(quiz_id);
    (await course).save();
  }
}
