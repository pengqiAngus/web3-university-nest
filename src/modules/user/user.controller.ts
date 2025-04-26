import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { GetNonceDto } from './dto/get-nonce.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取登录 nonce' })
  @ApiBody({ type: GetNonceDto })
  @ApiResponse({
    status: 200,
    description: '成功获取 nonce',
    schema: {
      type: 'object',
      properties: {
        nonce: {
          type: 'string',
          description: '随机生成的 nonce',
          example: '1234567890abcdef',
        },
      },
    },
  })
  @Post('nonce')
  getNonce(@Body() getNonceDto: GetNonceDto) {
    return this.userService.getNonce(getNonceDto.address);
  }

  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    type: LoginResponseDto,
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto.signature, loginDto.address);
  }

  @ApiOperation({ summary: '更新用户信息' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权访问',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '用户不存在',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '无效的请求数据',
  })
  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }

  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: UserResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.findOne(req.user.id);
  }
}
