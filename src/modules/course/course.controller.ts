import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CourseService } from './course.service';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { PageQueryDto } from './dto/page-query.dto';
import { PageResponse } from './interfaces/page-response.interface';

@ApiTags('课程管理')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: '分页获取课程列表' })
  @ApiParam({ name: 'page', description: '页码', required: false })
  @ApiParam({ name: 'pageSize', description: '每页条数', required: false })
  @ApiParam({ name: 'category', description: '分类' })
  @ApiParam({ name: 'keyword', description: '关键词' })
  @ApiResponse({ status: 200, description: '成功获取课程列表', type: [Course] })
  @Get('page')
  async findByPage(
    @Query() query: PageQueryDto,
  ): Promise<PageResponse<Course>> {
    return this.courseService.findByPage(query);
  }

  @ApiOperation({ summary: '获取所有课程' })
  @ApiResponse({ status: 200, description: '成功获取所有课程', type: [Course] })
  @Get('list')
  async findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @ApiOperation({ summary: '获取课程详情' })
  @ApiParam({ name: 'id', description: '课程ID' })
  @ApiResponse({ status: 200, description: '成功获取课程详情', type: Course })
  @Get('detail/:id')
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.courseService.findOne(id);
  }

  @ApiOperation({ summary: '创建新课程' })
  @ApiResponse({ status: 201, description: '课程创建成功', type: Course })
  @Post('add')
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.create(createCourseDto);
  }
}
