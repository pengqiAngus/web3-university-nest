import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class LoginResponseDto {
  @ApiProperty({ description: '用户信息' })
  user: UserResponseDto;

  @ApiProperty({ description: 'JWT Token' })
  token: string;
}
