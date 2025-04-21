import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { PageQueryDto } from './dto/page-query.dto';
import { PageResponse } from './interfaces/page-response.interface';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`课程 ID ${id} 不存在`);
    }
    return course;
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(course);
  }

  async findByPage(query: PageQueryDto): Promise<PageResponse<Course>> {
    const { page = 1, pageSize = 10, category, keyword } = query;

    // 构建查询条件
    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }

    // 执行分页查询
    const [items, total] = await this.courseRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });

    // 计算总页数
    const totalPages = Math.ceil(total / pageSize);

    return {
      items,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
      },
    };
  }
}
