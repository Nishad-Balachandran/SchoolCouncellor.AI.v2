import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

const entities = [path.join(__dirname, '../entities/**/*.entity{.ts,.js}')];
const isPostgres = process.env.DATABASE_TYPE === 'postgres';

export const typeOrmConfig: TypeOrmModuleOptions = isPostgres
  ? {
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'school_counselor',
      entities,
      migrations: [path.join(__dirname, '../migrations/**/*{.ts,.js}')],
      migrationsRun: true,
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }
  : {
      type: 'sqljs',
    location:
      process.env.DATABASE_FILE ||
      path.join(__dirname, '../../data/school-counselor.sqlite'),
      autoSave: true,
      entities,
      synchronize: true,
      logging: false,
    };
