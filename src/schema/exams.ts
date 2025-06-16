import { mysqlTable, bigint, varchar, timestamp, text, decimal, uniqueIndex } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { classes } from './classes';
import { profiles } from './users';

// 시험의 기본 정보를 담는 테이블
export const exams = mysqlTable('exams', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  classId: bigint('class_id', { mode: 'number' }).notNull().references(() => classes.id),
  name: varchar('name', { length: 255 }).notNull(),
  examDate: timestamp('exam_date').notNull(),
  totalScore: decimal('total_score', { precision: 5, scale: 2 }).default('100.00').notNull(),
  commonComment: text('common_comment'), // 공통 코멘트
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 학생별 시험 결과를 담는 테이블
export const studentExamResults = mysqlTable('student_exam_results', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  examId: bigint('exam_id', { mode: 'number' }).notNull().references(() => exams.id),
  studentProfileId: bigint('student_profile_id', { mode: 'number' }).notNull().references(() => profiles.id),
  score: decimal('score', { precision: 5, scale: 2 }).notNull(),
  individualComment: text('individual_comment'), // 개별 코멘트
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
    // 한 학생이 같은 시험에 대해 두 개의 결과를 가질 수 없도록 unique 제약조건 설정
    unq: uniqueIndex('student_exam_unq').on(table.examId, table.studentProfileId),
}));

// 관계 설정
export const examsRelations = relations(exams, ({ one, many }) => ({
  class: one(classes, { fields: [exams.classId], references: [classes.id] }),
  results: many(studentExamResults),
}));

export const studentExamResultsRelations = relations(studentExamResults, ({ one }) => ({
  exam: one(exams, { fields: [studentExamResults.examId], references: [exams.id] }),
  studentProfile: one(profiles, { fields: [studentExamResults.studentProfileId], references: [profiles.id] }),
}));