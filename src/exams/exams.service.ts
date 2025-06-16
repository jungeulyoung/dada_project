import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DB, DBType } from 'src/db/db.provider';
import { CreateExamDto } from './dto/create-exam.dto';
import { and, eq } from 'drizzle-orm';
import { classes } from 'src/schema/classes';
import { profiles } from 'src/schema/users';
import { exams } from 'src/schema/exams';

@Injectable()
export class ExamsService {
  constructor(@Inject(DB) private db: DBType) {}

  
  async createExam(userId: number, createExamDto: CreateExamDto) {
    const [teacherProfile] = await this.db.query.profiles.findMany({
      where: and(eq(profiles.userId, userId), eq(profiles.type, 'TEACHER')),
      limit: 1,
    });

    if (!teacherProfile) {
      throw new ForbiddenException('교사 프로필이 없어 시험을 생성할 수 없습니다.');
    }

    const classInfo = await this.db.query.classes.findFirst({
      where: and(
        eq(classes.id, createExamDto.classId),
        eq(classes.teacherProfileId, teacherProfile.id),
      ),
    });

    if (!classInfo) {
      throw new ForbiddenException('해당 수업에 시험을 생성할 권한이 없습니다.');
    }

    
    const newExamResult = await this.db.insert(exams).values({
      ...createExamDto,
      examDate: new Date(createExamDto.examDate), // string -> Date 변환
    });

    return { id: newExamResult[0].insertId };
  }
}