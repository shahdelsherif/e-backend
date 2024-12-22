import { Injectable, UnauthorizedException, NotFoundException, Inject, forwardRef, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CoursesService } from 'src/courses/courses.service';
import { LogService } from 'src/log/log.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService,@Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,private logService: LogService) {}

  async register(userData: Partial<User>): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
      const newUser = new this.userModel(userData);
      const savedUser = await newUser.save();
      return { success: true, user: savedUser }; 
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();

//    console.log('comparison' , await bcrypt.compare(password, user.password));

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }

    this.logService.logFailedLogin(user);
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    
    try {
      const payload = { email: user.email, sub: user._id, ID: user.ID};
      const accessToken = this.jwtService.sign(payload);
  
      return {
        success: true,
        role: user.role,
        user_ID: user.ID,
        access_token: accessToken,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
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

  //get database id using user ID 
  async getDB_id(ID: number): Promise<any>{
    const user = await this.userModel.findOne({ ID: ID}).exec();
    return user._id.toString();
  }

  async getDB_ids(IDs: number[]): Promise<string[]> {
    const users = await this.userModel.find({ ID: { $in: IDs } }).exec();
    return users.map(user => user._id.toString());
  }

  async findStudent(id: number): Promise<User | null> {
    const student = await this.userModel.findOne({ ID: id}).exec();
    if (!student) {
      throw new NotFoundException("Student with this ID not found.");
    }
    return student;
  }

  async getStudentProfile(_id: string): Promise<User | null> {
    const student = await this.userModel.findOne({ _id: _id, role: 'student' }).exec();
    if (!student) {
      throw new NotFoundException("Student not found.");
    }

    const completion_rate = this.calculateCompletionRate(student);
    student.studentMetrics.completionRate = await completion_rate;

    const average_score = this.calculateAgerageScore(student);
    student.studentMetrics.averageScore = average_score;
    
    // we will need to calculate engagement trend


    return student;
  }

  async getInstructorProfile(_id: string): Promise<User | null> {
    const instructor = await this.userModel.findOne({ _id: _id, role: 'instructor' }).exec();
    if (!instructor) {
      throw new NotFoundException("Instructor not found.");
    }
    return instructor;
  }

  async getAdminProfile(_id: string): Promise<User> {

    const admin = await this.userModel.findOne({ _id: _id, role: 'admin' }).exec();
    if (!admin) {
      throw new NotFoundException("Admin not found.");
    }
    return admin;
  }

  async findInstructor(name_: string): Promise<User | null> {
    const instructor = await this.userModel.findOne({ name: name_, role: 'instructor' }).exec();
    if (!instructor) {
      throw new NotFoundException("Instructor with this Name not found.");
    }
    return instructor;
  }

  async getInstructors(): Promise<User[] | null> {
    const instructors = await this.userModel.find({role: 'instructor' }).exec();
    if (!instructors) {
      throw new NotFoundException("Instructor with this Name not found.");
    }
    return instructors;
  }
 

  async update(id: string, userData: Partial<User>): Promise<{ success: boolean; user?: User; message?: string }> {

    try {
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, userData, { new: true })
        .exec();

      if (!updatedUser) {
        throw new NotFoundException('User not found for update');
      }
      return { success: true, user: updatedUser }; 
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found for deletion');
    }
    return deletedUser;
  }

  calculateAgerageScore(user: User): number{
    const courses_scores = user.enrolledCoursesScores;
    const averageScore = courses_scores.reduce((acc, course) => acc + course.score, 0) / courses_scores.length;

    return Math.round(averageScore);
  }

  async calculateCompletionRate(user: User): Promise<number> {
    const enrolled_courses = user.enrolledCourses;
  
    const courses = await this.coursesService.findMany(enrolled_courses);
    
    const completedCourses = courses.reduce((acc, course) => acc + (course.completed ? 1 : 0), 0);
  
    const completion_rate = (completedCourses / 48) * 100;
  
    return Math.round(completion_rate);
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


  async getAverageScoresForInstructor(): Promise<{ studentId: string; averageScore: number }[]> {
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
