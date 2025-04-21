// src/lambda.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { configure as serverlessExpress } from '@vendia/serverless-express';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    app.setGlobalPrefix('api');

    // 启用 CORS
    app.enableCors();

    await app.init();
    cachedServer = serverlessExpress({ app: expressApp });
  }
  return cachedServer;
}

export const handler = async (event: any, context: any) => {
  const server = await bootstrap();
  return server(event, context);
};
