import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app/app.module';
import { DatabaseService } from './modules/database/database.service';
import { config } from 'dotenv';

// 确保在最开始就加载环境变量
config();

async function bootstrap() {
  // 初始化数据库
  const dbService = new DatabaseService();
  await dbService.initializeDatabase();

  // 创建应用实例
  const app = await NestFactory.create(AppModule);

  // 设置全局路由前缀
  app.setGlobalPrefix('api');

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`应用程序正在运行: ${await app.getUrl()}`);
}
bootstrap();
