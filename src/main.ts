import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';
import { DatabaseService } from './modules/database/database.service';
import { config } from 'dotenv';

// 确保在最开始就加载环境变量
config();

async function bootstrap() {
  // 创建应用实例
  const app = await NestFactory.create(AppModule);

  // 初始化数据库
  const dbService = app.get(DatabaseService);
  await dbService.initializeDatabase();

  // 设置全局路由前缀
  app.setGlobalPrefix('api');

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // 配置 Swagger
  const config = new DocumentBuilder()
    .setTitle('Web3 University API')
    .setDescription('Web3 University 后端 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`应用程序正在运行: ${await app.getUrl()}`);
}
bootstrap();
