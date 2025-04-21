import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty({ message: '课程名称不能为空' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '课程分类不能为空' })
  @IsString()
  category: string;

  @IsNotEmpty({ message: '课程描述不能为空' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: '课程价格不能为空' })
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  imgInfo?: any;

  @IsOptional()
  fileInfo?: any;
}
