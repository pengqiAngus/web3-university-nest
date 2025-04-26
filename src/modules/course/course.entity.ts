import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('courses')
export class Course {
  @ApiProperty({ description: '课程ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '课程名称' })
  @Column()
  name: string;

  @ApiProperty({ description: '课程分类' })
  @Column()
  category: string;

  @ApiProperty({ description: '课程描述' })
  @Column('text')
  description: string;

  @ApiProperty({ description: '课程价格' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: '课程时长（分钟）', required: false })
  @Column('int', { nullable: true })
  duration: number;

  @ApiProperty({ description: '课程图片信息', required: false })
  @Column('jsonb', { nullable: true })
  imgInfo: any;

  @ApiProperty({ description: '课程文件信息', required: false })
  @Column('jsonb', { nullable: true })
  fileInfo: any;

  @ApiProperty({ description: '创建时间' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({ description: '课程图片URL', required: false })
  imgUrl?: string;

  @ApiProperty({ description: '课程文件URL', required: false })
  fileUrl?: string;
}
