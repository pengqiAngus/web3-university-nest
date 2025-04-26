import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: '用户名',
    required: false,
    example: 'Web3 Developer',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: '头衔',
    required: false,
    example: 'Senior Blockchain Engineer',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: '个人描述',
    required: false,
    example: '区块链技术专家，专注于 Web3 开发',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '头像信息',
    required: false,
    example: {
      id: 'avatar-123',
      url: 'https://example.com/avatar.jpg',
    },
  })
  @IsOptional()
  avatar?: {
    id: string;
    url: string;
  };
}
