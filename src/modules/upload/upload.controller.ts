import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
  Param,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { Express } from 'express';

@ApiTags('文件上传')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '要上传的文件',
        },
        title: {
          type: 'string',
          description: '文件标题（可选）',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '文件上传成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            fileInfo: { type: 'object' },
          },
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|pdf|doc|docx|mp4)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('title') title?: string,
  ) {
    try {
      const fileInfo = await this.uploadService.uploadFile(file, title);
      return {
        success: true,
        message: '文件上传成功',
        data: {
          fileInfo,
        },
      };
    } catch (error) {
      throw new BadRequestException('文件上传失败：' + error.message);
    }
  }

  @ApiOperation({ summary: '获取文件预签名URL' })
  @ApiParam({ name: 'id', description: '文件ID' })
  @ApiQuery({
    name: 'expiresIn',
    description: 'URL过期时间（秒）',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '获取预签名URL成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            url: { type: 'string' },
            expiresIn: { type: 'number' },
          },
        },
      },
    },
  })
  @Get('get-temp-url')
  async getTempUrl(
    @Query('id') id: string,
    @Query('expiresIn') expiresIn?: number,
  ) {
    try {
      const signedUrl = await this.uploadService.getSingleSignedUrl(
        id,
        expiresIn,
      );
      return {
        success: true,
        message: '获取预签名URL成功',
        data: {
          url: signedUrl,
          expiresIn: expiresIn || 3600,
        },
      };
    } catch (error) {
      throw new BadRequestException('获取预签名URL失败：' + error.message);
    }
  }
}
