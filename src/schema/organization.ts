import { mysqlTable, varchar, serial } from 'drizzle-orm/mysql-core';

export const organizations = mysqlTable('organizations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
});