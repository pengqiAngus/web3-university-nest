import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { PageQueryDto } from './dto/page-query.dto';
import { PageResponse } from './interfaces/page-response.interface';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private uploadService: UploadService,
  ) {}

  async findAll(): Promise<Course[]> {
    const courses = await this.courseRepository.find();
    return await Promise.all(
      courses.map(async (course) => {
        if (course.imgInfo?.id) {
          const imgUrl = await this.uploadService.getSingleSignedUrl(
            course.imgInfo.id,
          );
          return { ...course, imgUrl };
        }
        return course;
      }),
    );
  }

  async findOne(
    id: number,
  ): Promise<Course & { imgUrl?: string; fileUrl?: string }> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`课程 ID ${id} 不存在`);
    }

    let imgUrl: string | undefined;
    let fileUrl: string | undefined;

    if (course.imgInfo?.id) {
      imgUrl = await this.uploadService.getSingleSignedUrl(course.imgInfo.id);
    }
    if (course.fileInfo?.id) {
      fileUrl = await this.uploadService.getSingleSignedUrl(course.fileInfo.id);
    }

    return { ...course, imgUrl, fileUrl };
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

    // 为每个课程添加签名的图片URL
    const itemsWithUrls = await Promise.all(
      items.map(async (course) => {
        if (course.imgInfo?.id) {
          const imgUrl = await this.uploadService.getSingleSignedUrl(
            course.imgInfo.id,
          );
          return { ...course, imgUrl };
        }
        return course;
      }),
    );

    // 计算总页数
    const totalPages = Math.ceil(total / pageSize);

    return {
      items: itemsWithUrls,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
      },
    };
  }
}
