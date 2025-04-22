import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from '../course/course.module';
import { DatabaseModule } from '../database/database.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使配置在整个应用中可用
      envFilePath: ['.env.development', '.env.production', '.env'],
    }),
    DatabaseModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'web3_university',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // 开发环境下自动同步数据库结构
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    CourseModule,
    UploadModule,
  ],
})
export class AppModule {}
