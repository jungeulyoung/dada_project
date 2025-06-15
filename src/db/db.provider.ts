import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from '../schema';
import { FactoryProvider } from '@nestjs/common';

export const DB = Symbol('DB_SERVICE');
export type DBType = ReturnType<typeof drizzle<typeof schema>>;

export const DbProvider: FactoryProvider = {
  provide: DB,
  useFactory: async () => {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    return drizzle(connection, { schema, mode: 'default' });
  },
};