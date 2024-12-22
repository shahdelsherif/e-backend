import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MultimediaService } from './multimedia.service';
import { Multimedia } from './multimedia.schema';

@Controller('multimedia')
export class MultimediaController {
  constructor(private readonly multimediaService: MultimediaService) {}

  @Post()
  create(@Body() multimediaData: Partial<Multimedia>) {
    return this.multimediaService.create(multimediaData);
  }

  @Get()
  findAll() {
    return this.multimediaService.findAll();
  }

  @Get('course/:courseId')
  findByCourseId(@Param('courseId') courseId: string) {
    return this.multimediaService.findByCourseId(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.multimediaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() multimediaData: Partial<Multimedia>) {
    return this.multimediaService.update(id, multimediaData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.multimediaService.delete(id);
  }
}
