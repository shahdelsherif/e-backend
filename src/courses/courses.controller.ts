import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './course.schema';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(@Body() createCourseDto: Partial<Course>): Promise<any> {
    return this.coursesService.create(createCourseDto);
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
  async getMediaRate(@Param("courseId")courseId:string){
    return this.coursesService.getMediaRates(courseId);
  }


  @Get(':courseId/assesment-result')
  async getAssesmentResult(@Param("courseId")courseId:string){
    return this.coursesService.getAssesmentResult(courseId);
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
