import { mysqlTable, bigint, varchar, timestamp, mysqlEnum, text, primaryKey } from 'drizzle-orm/mysql-core';
import { profiles } from './users';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';

// 공지 내용 자체를 담는 테이블
export const notices = mysqlTable('notices', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  authorProfileId: bigint('author_profile_id', { mode: 'number' }).notNull().references(() => profiles.id),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  importance: mysqlEnum('importance', ['NORMAL', 'IMPORTANT'])
    .default('NORMAL')
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 공지를 게시할 대상을 저장하는 테이블
export const noticeTargets = mysqlTable('notice_targets', {
  noticeId: bigint('notice_id', { mode: 'number' }).notNull().references(() => notices.id),
  targetType: mysqlEnum('target_type', ['ORGANIZATION', 'CLASS', 'SECTION']).notNull(),
  targetId: bigint('target_id', { mode: 'number' }).notNull(),
}, (table) => ({
    // noticeId, targetType, targetId를 묶어 복합 기본 키(Composite Primary Key)로 설정
    pk: primaryKey({ columns: [table.noticeId, table.targetType, table.targetId] })
}));

// 관계 설정
export const noticesRelations = relations(notices, ({ one, many }) => ({
  author: one(profiles, {
    fields: [notices.authorProfileId],
    references: [profiles.id],
  }),
  targets: many(noticeTargets),
}));

export const noticeTargetsRelations = relations(noticeTargets, ({ one }) => ({
  notice: one(notices, {
    fields: [noticeTargets.noticeId],
    references: [notices.id],
  }),
}));