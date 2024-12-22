import { Controller, Get, Post, Body, Param, Put,Req, Delete, UseGuards, Request} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: any) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password,
    );
   
    return this.usersService.login(user);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  //@UseGuards(AuthGuard('jwt')) 
  @Get(':id/courses')
  async getEnrolledCourses(@Param('id') userId: string) {
    return this.usersService.getEnrolledCourses(userId);  // Get enrolled courses for the user
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get(':id/completed-courses')
  async getCompletedCourses(@Param('id') userId: string) {
    return this.usersService.getCompletedCourses(userId);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get('students/average-scores')
  async getAverageScores() {
    return this.usersService.getAverageScoresForInstructor();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('student')
  async getStudentProfile(@Req() req: any) {
    const studentId = req.user.userId;
    return this.usersService.getStudentProfile(studentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('instructor')
  async getInstructorProfile(@Req() req: any) {
    const instructorId = req.user.userId;
    return this.usersService.getInstructorProfile(instructorId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin')
  async getAdminProfile(@Req() req: any) {
    const adminId = req.user.userId;
    return this.usersService.getAdminProfile(adminId);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get('instructors')
  async findInstructors() {
    return this.usersService.getInstructors();
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get('engagement-trends')
  getEngagementTrends() {
    return this.usersService.getEngagementTrends();
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() userData: Partial<User>) {
    return this.usersService.update(id, userData);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get('instructor/:name')
  async findInstructor(@Param('name') name_: string) {
    return this.usersService.findInstructor(name_);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
