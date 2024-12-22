<<<<<<< HEAD
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService,private coursesService: CoursesService,) {}

  async register(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findStudent(id: number): Promise<User | null> {
    const student = await this.userModel.findOne({ ID: id, role: 'student' }).exec();
    if (!student) {
      throw new NotFoundException("Student with this ID not found.");
    }
    return student;
  }

  async findInstructor(name_: string): Promise<User | null> {
    const instructor = await this.userModel.findOne({ name: name_, role: 'instructor' }).exec();
    if (!instructor) {
      throw new NotFoundException("Instructor with this Name not found.");
    }
    return instructor;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found for update');
    }
    return updatedUser;
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found for deletion');
    }
    return deletedUser;
  }

  async getEngagementTrends(): Promise<{ name: string; engagementTrends: string }[]> {
    const students = await this.userModel.find({ role: 'student' }).exec();
  
    if (!students || students.length === 0) {
      throw new NotFoundException('No students found.');
    }
  
    // Map each student's name and engagement trends
    const trends = students.map((student) => ({
      name: student.name,
      engagementTrends: student.studentMetrics.engagementTrends,
    }));
  
    return trends;
  }

  async getEnrolledCourses(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const courseIds = user.enrolledCourses.map(courseId => courseId.toString());
    const courses = await this.coursesService.findMany(courseIds);
    return courses;
  }

  async getCompletedCourses(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const completedCourses = await this.coursesService.findManyByCriteria({
      _id: { $in: user.enrolledCourses }, // Filter only enrolled courses
      completed: true, // Fetch courses with completed: true
    });

    return completedCourses;
  }

  async getEnrolledCoursesScores(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const courses_scores = user.enrolledCoursesScores;
    return courses_scores;
  }

  async getAverageScores(): Promise<{ studentId: string; averageScore: number }[]> {
  // Fetch all users with the role of "student"
  const students = await this.userModel.find({ role: 'student' }).exec();

  if (!students || students.length === 0) {
    throw new NotFoundException('No students found');
  }

  // Map the required data (student ID and average score)
  const studentsAvgScores = students.map(student => ({
    studentId: student.ID.toString(),
    averageScore: student.studentMetrics?.averageScore || 0, // Default to 0 if averageScore is missing
  }));

  return studentsAvgScores;

  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
=======
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService,private coursesService: CoursesService,) {}

  async register(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findStudent(id: number): Promise<User | null> {
    const student = await this.userModel.findOne({ ID: id, role: 'student' }).exec();
    if (!student) {
      throw new NotFoundException("Student with this ID not found.");
    }
    return student;
  }

  async findInstructor(name_: string): Promise<User | null> {
    const instructor = await this.userModel.findOne({ name: name_, role: 'instructor' }).exec();
    if (!instructor) {
      throw new NotFoundException("Instructor with this Name not found.");
    }
    return instructor;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found for update');
    }
    return updatedUser;
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found for deletion');
    }
    return deletedUser;
  }

  async getEngagementTrends(): Promise<{ name: string; engagementTrends: string }[]> {
    const students = await this.userModel.find({ role: 'student' }).exec();
  
    if (!students || students.length === 0) {
      throw new NotFoundException('No students found.');
    }
  
    // Map each student's name and engagement trends
    const trends = students.map((student) => ({
      name: student.name,
      engagementTrends: student.studentMetrics.engagementTrends,
    }));
  
    return trends;
  }

  async getEnrolledCourses(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const courseIds = user.enrolledCourses.map(courseId => courseId.toString());
    const courses = await this.coursesService.findMany(courseIds);
    return courses;
  }

  async getCompletedCourses(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const completedCourses = await this.coursesService.findManyByCriteria({
      _id: { $in: user.enrolledCourses }, // Filter only enrolled courses
      completed: true, // Fetch courses with completed: true
    });

    return completedCourses;
  }

  async getEnrolledCoursesScores(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const courses_scores = user.enrolledCoursesScores;
    return courses_scores;
  }

  async getAverageScores(): Promise<{ studentId: string; averageScore: number }[]> {
  // Fetch all users with the role of "student"
  const students = await this.userModel.find({ role: 'student' }).exec();

  if (!students || students.length === 0) {
    throw new NotFoundException('No students found');
  }

  // Map the required data (student ID and average score)
  const studentsAvgScores = students.map(student => ({
    studentId: student.ID.toString(),
    averageScore: student.studentMetrics?.averageScore || 0, // Default to 0 if averageScore is missing
  }));

  return studentsAvgScores;

  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
>>>>>>> 95f5c6d7087499e384218a8db91bf7d0e60972ee