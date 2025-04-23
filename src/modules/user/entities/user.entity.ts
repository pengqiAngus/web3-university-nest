import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User {
  @ApiProperty({ description: '用户ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '钱包地址' })
  @Column({ unique: true })
  address: string;

  @ApiProperty({ description: '用户名', required: false })
  @Column({ nullable: true })
  username: string;

  @ApiProperty({ description: '头衔', required: false })
  @Column({ nullable: true })
  title: string;

  @ApiProperty({ description: '描述', required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: '头像信息', required: false })
  @Column('jsonb', { nullable: true })
  avatar: any;

  @ApiProperty({ description: '登录随机数', required: false })
  @Column({ nullable: true })
  nonce: string;
}
