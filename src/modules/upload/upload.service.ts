import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') as string,
        secretAccessKey: this.configService.get(
          'AWS_SECRET_ACCESS_KEY',
        ) as string,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, title?: string) {
    const bucketName = this.configService.get('AWS_S3_BUCKET_NAME') as string;
    const fileId = uuidv4();

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileId,
          Body: file.buffer,
          ContentType: file.mimetype,
          Metadata: {
            title: title || file.originalname,
          },
        }),
      );

      return {
        id: fileId,
        title: title || file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      console.error('上传错误详情:', error);
      throw new BadRequestException(`上传文件失败: ${error.message}`);
    }
  }

  async getSingleSignedUrl(key: string, expiresIn = 3600) {
    const bucketName = this.configService.get('AWS_S3_BUCKET_NAME') as string;

    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      return signedUrl;
    } catch (error) {
      console.error('获取签名URL错误详情:', error);
      throw new BadRequestException(`获取签名URL失败: ${error.message}`);
    }
  }
}
