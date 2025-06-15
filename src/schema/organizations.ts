import { mysqlTable, bigint, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const organizations = mysqlTable('organizations', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});