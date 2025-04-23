import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetNonceDto {
  @ApiProperty({ description: '钱包地址' })
  @IsString()
  @IsNotEmpty()
  address: string;
}
