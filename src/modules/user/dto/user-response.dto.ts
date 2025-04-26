import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: '用户ID' })
  id: string;

  @ApiProperty({ description: '钱包地址' })
  address: string;

  @ApiProperty({ description: '用户名', required: false })
  username?: string;

  @ApiProperty({ description: '头衔', required: false })
  title?: string;

  @ApiProperty({ description: '描述', required: false })
  description?: string;

  @ApiProperty({ description: '头像信息', required: false })
  avatar?: {
    id: string;
    url: string;
  };
}
