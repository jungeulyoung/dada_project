import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DB, DBType } from '../db/db.provider';
import * as bcrypt from 'bcrypt';
import { organizations } from 'src/schema/organizations';
import { profiles, users } from 'src/schema/users';
import { noticeTargets, notices } from 'src/schema/notices';
import { classes, sectionStudents, sections } from 'src/schema/classes';
import { sql } from 'drizzle-orm'; // sql 함수를 import 합니다.


@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(@Inject(DB) private db: DBType) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    await this.seed();
  }

  private async seed() {
    this.logger.log('Start seeding database...');

     this.logger.log('Disabling foreign key checks and truncating tables...');
    
    // 1. 외래 키 제약조건 비활성화
    await this.db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`);

    // 2. 모든 테이블 TRUNCATE (데이터 삭제 및 ID 카운터 초기화)
    await this.db.execute(sql`TRUNCATE TABLE notice_targets;`);
    await this.db.execute(sql`TRUNCATE TABLE notices;`);
    await this.db.execute(sql`TRUNCATE TABLE section_students;`);
    await this.db.execute(sql`TRUNCATE TABLE sessions;`);
    await this.db.execute(sql`TRUNCATE TABLE sections;`);
    await this.db.execute(sql`TRUNCATE TABLE classes;`);
    await this.db.execute(sql`TRUNCATE TABLE profiles;`);
    await this.db.execute(sql`TRUNCATE TABLE users;`);
    await this.db.execute(sql`TRUNCATE TABLE organizations;`);

    // 3. 외래 키 제약조건 다시 활성화
    await this.db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);

    this.logger.log('Tables truncated and foreign key checks re-enabled.');

    const hashedPassword = bcrypt.hashSync('password123', 10);

    const orgResult = await this.db
      .insert(organizations)
      .values({ name: '다다에듀 대치점' });
    const newOrgId = orgResult[0].insertId;
    this.logger.log(`Created organization with ID: ${newOrgId}`);

    const teacherResult = await this.db
      .insert(users)
      .values({ email: 'teacher@example.com', password: hashedPassword });
    const teacherUserId = teacherResult[0].insertId;
    
    await this.db.insert(profiles).values({
      userId: teacherUserId,
      organizationId: newOrgId, 
      name: '김선생',
      type: 'TEACHER',
    });
    this.logger.log('Created teacher user and profile.');

    const studentResult = await this.db
      .insert(users)
      .values({ email: 'student@example.com', password: hashedPassword });
    const studentUserId = studentResult[0].insertId;
    
    await this.db.insert(profiles).values({
      userId: studentUserId,
      organizationId: newOrgId, 
      name: '박학생',
      type: 'STUDENT',
    });
    this.logger.log('Created student user and profile.');

    const classResult = await this.db.insert(classes).values({
        organizationId: newOrgId,
        name: '고등 수학 정규반',
        teacherProfileId: teacherUserId, // 김선생님을 담당으로 지정
    });
    const newClassId = classResult[0].insertId;
    this.logger.log(`Created class with ID: ${newClassId}`);
    
    const sectionResult = await this.db.insert(sections).values({
        classId: newClassId,
        teacherProfileId: teacherUserId,
        name: 'A반',
        status: 'ONGOING',
    });
    const newSectionId = sectionResult[0].insertId;
    this.logger.log(`Created section with ID: ${newSectionId}`);

    // 학생을 분반에 배정
    await this.db.insert(sectionStudents).values({
        sectionId: newSectionId,
        studentProfileId: studentUserId,
    });
    this.logger.log('Assigned student to section.');

    this.logger.log('Database seeding finished.');
  }
}