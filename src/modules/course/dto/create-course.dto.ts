import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ description: '课程名称' })
  @IsNotEmpty({ message: '课程名称不能为空' })
  @IsString()
  name: string;

  @ApiProperty({ description: '课程分类' })
  @IsNotEmpty({ message: '课程分类不能为空' })
  @IsString()
  category: string;

  @ApiProperty({ description: '课程描述' })
  @IsNotEmpty({ message: '课程描述不能为空' })
  @IsString()
  description: string;

  @ApiProperty({ description: '课程价格' })
  @IsNotEmpty({ message: '课程价格不能为空' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '课程时长（分钟）', required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ description: '课程图片信息', required: false })
  @IsOptional()
  imgInfo?: any;

  @ApiProperty({ description: '课程文件信息', required: false })
  @IsOptional()
  fileInfo?: any;
}
