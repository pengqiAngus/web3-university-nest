import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { PageQueryDto } from './dto/page-query.dto';
import { PageResponse } from './interfaces/page-response.interface';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('page')
  async findByPage(
    @Query() query: PageQueryDto,
  ): Promise<PageResponse<Course>> {
    return this.courseService.findByPage(query);
  }

  @Get('list')
  async findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @Get('detail/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Course> {
    return this.courseService.findOne(id);
  }

  @Post('add')
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.create(createCourseDto);
  }
}
