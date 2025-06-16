import { mysqlTable, bigint, varchar, timestamp, mysqlEnum, text } from 'drizzle-orm/mysql-core';
import { organizations } from './organizations';
import { relations } from 'drizzle-orm';
import { sectionStudents } from './classes'; 
import { studentExamResults } from './exams';


// 순수 계정 정보
export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 사용자의 역할 프로필
export const profiles = mysqlTable('profiles', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id),
  organizationId: bigint('organization_id', { mode: 'number' }).notNull().references(() => organizations.id),
  name: varchar('name', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['STUDENT', 'PARENT', 'TEACHER', 'ADMIN']).notNull(),
  parentProfileId: bigint('parent_profile_id', { mode: 'number' }), // 학생-학부모 연결용 (Self-reference)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Drizzle 관계 설정
export const usersRelations = relations(users, ({ one, many }) => ({
  profiles: many(profiles),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
  organization: one(organizations, { fields: [profiles.organizationId], references: [organizations.id] }),
  parent: one(profiles, { fields: [profiles.parentProfileId], references: [profiles.id], relationName: 'parent_profile' }),
  studentSections: many(sectionStudents),
  examResults: many(studentExamResults),

}));