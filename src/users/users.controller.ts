import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request} from '@nestjs/common';
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

  @Get(':id/scores')
  async getEnrolledCoursesScores(@Param('id') userId: string) {
    return this.usersService.getEnrolledCoursesScores(userId);  // Get enrolled courses for the user
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get(':id/completed-courses')
  async getCompletedCourses(@Param('id') userId: string) {
    return this.usersService.getCompletedCourses(userId);
  }

  @Get('students/average-scores')
  async getAverageScores() {
    return this.usersService.getAverageScores();
  }

  @Get('student/:id')
  async findStudent(@Param('id') id: number) {
    return this.usersService.findStudent(id);
  }

  @Get('instructor/:name')
  async findInstructor(@Param('name') name_: string) {
    return this.usersService.findInstructor(name_);
  }

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
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
