import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, HttpException, HttpStatus,Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './course.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(@Body() createCourseDto: Partial<Course>): Promise<any> {
    return this.coursesService.create(createCourseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/enroll')
  async enrollStudent(@Param('id') courseId: string, @Req() req: any) {
    const userId = req.user.userId;
    try {
      await this.coursesService.enrollStudent(courseId, userId);
      return { message: 'Enrollment successful!' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @Get('title/:title')
  async getCourseByTitle(@Param('title') title: string) {
    return this.coursesService.getOneByTitle(title);
  }

  @Get(':courseId/media-rates')
  getMediaRates(@Param('courseId') courseId: string) {
  return this.coursesService.getMediaRates(courseId);
  }

  @Get(':courseId/assesments-results')
  getAssesmentsResults(@Param('courseId') courseId: string) {
  return this.coursesService.getAssesmentsResults(courseId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: Partial<Course>,
  ): Promise<Course> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Course> {
    return this.coursesService.remove(id);
  }
}
