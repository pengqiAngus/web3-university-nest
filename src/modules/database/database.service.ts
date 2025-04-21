import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class DatabaseService {
  private readonly client: Client;
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: 'postgres', // 初始连接到默认数据库
      ssl: {
        rejectUnauthorized: false, // AWS RDS 需要
      },
    };

    this.logger.log('Database configuration:', {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database,
    });

    this.client = new Client(config);
  }

  async initializeDatabase() {
    try {
      this.logger.log('正在连接数据库...');
      await this.client.connect();
      this.logger.log('数据库连接成功');

      // 检查数据库是否存在
      const dbName = process.env.DB_DATABASE || 'web3_university';
      this.logger.log(`检查数据库 ${dbName} 是否存在`);

      const result = await this.client.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [dbName],
      );

      // 如果数据库不存在，创建它
      if (result.rowCount === 0) {
        this.logger.log(`数据库 ${dbName} 不存在，正在创建...`);
        // 确保没有活动连接
        await this.client.query(
          `
          SELECT pg_terminate_backend(pid) 
          FROM pg_stat_activity 
          WHERE datname = $1
        `,
          [dbName],
        );

        await this.client.query(`CREATE DATABASE ${dbName}`);
        this.logger.log('数据库创建成功');
      } else {
        this.logger.log('数据库已存在');
      }
    } catch (error) {
      this.logger.error('初始化数据库时出错:', error);
      if (error.code === '28000') {
        this.logger.error(
          '认证错误：请检查数据库用户名和密码是否正确，以及确保您的IP地址已被允许访问',
        );
      }
      throw error;
    } finally {
      try {
        await this.client.end();
        this.logger.log('数据库连接已关闭');
      } catch (error) {
        this.logger.error('关闭数据库连接时出错:', error);
      }
    }
  }
}
