import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '签名', example: '0x1234...' })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({ description: '钱包地址', example: '0x5678...' })
  @IsString()
  @IsNotEmpty()
  address: string;
}
