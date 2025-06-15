import { mysqlTable, bigint, varchar, timestamp, primaryKey } from 'drizzle-orm/mysql-core';
import { organizations } from './organizations';
import { profiles } from './users';
import { relations } from 'drizzle-orm';

// 수업(과목) 템플릿
export const classes = mysqlTable('classes', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  organizationId: bigint('organization_id', { mode: 'number' }).notNull().references(() => organizations.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 실제 수강반 (분반)
export const sections = mysqlTable('sections', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  classId: bigint('class_id', { mode: 'number' }).notNull().references(() => classes.id),
  teacherProfileId: bigint('teacher_profile_id', { mode: 'number' }).references(() => profiles.id),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 분반-학생 연결 테이블 (N:M 관계)
export const sectionStudents = mysqlTable('section_students', {
  sectionId: bigint('section_id', { mode: 'number' }).notNull().references(() => sections.id),
  studentProfileId: bigint('student_profile_id', { mode: 'number' }).notNull().references(() => profiles.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.sectionId, table.studentProfileId] }),
}));


export const classesRelations = relations(classes, ({ one, many }) => ({
  organization: one(organizations, { fields: [classes.organizationId], references: [organizations.id] }),
  sections: many(sections),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  class: one(classes, { fields: [sections.classId], references: [classes.id] }),
  teacher: one(profiles, { fields: [sections.teacherProfileId], references: [profiles.id] }),
  students: many(sectionStudents),
}));

export const sectionStudentsRelations = relations(sectionStudents, ({ one }) => ({
  section: one(sections, { fields: [sectionStudents.sectionId], references: [sections.id] }),
  studentProfile: one(profiles, { fields: [sectionStudents.studentProfileId], references: [profiles.id] }),
}));
export const sessions = mysqlTable('sessions', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  sectionId: bigint('section_id', { mode: 'number' }).notNull().references(() => sections.id),
  title: varchar('title', { length: 255 }).notNull(),
  sessionOrder: bigint('session_order', { mode: 'number' }).notNull(),
  sessionDate: timestamp('session_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// sessions 테이블 관계 설정
export const sessionsRelations = relations(sessions, ({ one }) => ({
  section: one(sections, {
    fields: [sessions.sectionId],
    references: [sections.id]
  }),
}));