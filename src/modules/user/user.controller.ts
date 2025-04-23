import { Controller, Get, Post, Body, Put, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { GetNonceDto } from './dto/get-nonce.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取登录 nonce' })
  @Post('nonce')
  getNonce(@Body() getNonceDto: GetNonceDto) {
    return this.userService.getNonce(getNonceDto.address);
  }

  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto.signature, loginDto.address);
  }

  @ApiOperation({ summary: '更新用户信息' })
  @Put('profile')
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }
}
