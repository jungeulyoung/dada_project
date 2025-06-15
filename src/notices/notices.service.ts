import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DB, DBType } from 'src/db/db.provider';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { noticeTargets, notices } from 'src/schema/notices';
import { profiles } from 'src/schema/users';
import { and, eq, inArray, or, desc, count, exists, SQL } from 'drizzle-orm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class NoticesService {
  constructor(@Inject(DB) private db: DBType) {}

  async createNotice(userId: number, createNoticeDto: CreateNoticeDto) {
    return this.db.transaction(async (tx) => {
      const [authorProfile] = await tx.query.profiles.findMany({ where: eq(profiles.userId, userId), limit: 1 });
      if (!authorProfile) { throw new NotFoundException('작성자 프로필을 찾을 수 없습니다.'); }
      const noticeInsertResult = await tx.insert(notices).values({ authorProfileId: authorProfile.id, title: createNoticeDto.title, content: createNoticeDto.content });
      const newNoticeId = noticeInsertResult[0].insertId;
      if (createNoticeDto.targets && createNoticeDto.targets.length > 0) {
        const targetsData = createNoticeDto.targets.map((target) => ({ noticeId: newNoticeId, targetType: target.type, targetId: target.id, }));
        await tx.insert(noticeTargets).values(targetsData);
      }
      return { id: newNoticeId };
    });
  }

   async findMyNotices(userId: number, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const userProfiles = await this.db.query.profiles.findMany({
      where: eq(profiles.userId, userId),
      with: {
        studentSections: {
          with: {
            section: true,
          },
        },
      },
    });

    if (userProfiles.length === 0) {
      return { items: [], meta: { totalItems: 0, itemCount: 0, itemsPerPage: limit, totalPages: 0, currentPage: page } };
    }

    const organizationIds = userProfiles.map(p => p.organizationId);
    const sectionIds = userProfiles.flatMap(p => p.studentSections?.map(ss => ss.sectionId) || []);
    const classIds = userProfiles.flatMap(p => p.studentSections?.map(ss => ss.section.classId) || []);

    const targetConditions: SQL[] = [];

    // 생성된 condition이 undefined가 아닌지 확인하는 if문을 추가합니다.
    if (organizationIds.length > 0) {
      const condition = and(
        eq(noticeTargets.targetType, 'ORGANIZATION'),
        inArray(noticeTargets.targetId, organizationIds)
      );
      if (condition) {
        targetConditions.push(condition);
      }
    }

    if (classIds.length > 0) {
      const condition = and(
        eq(noticeTargets.targetType, 'CLASS'),
        inArray(noticeTargets.targetId, classIds)
      );
      if (condition) {
        targetConditions.push(condition);
      }
    }

    if (sectionIds.length > 0) {
      const condition = and(
        eq(noticeTargets.targetType, 'SECTION'),
        inArray(noticeTargets.targetId, sectionIds)
      );
      if (condition) {
        targetConditions.push(condition);
      }
    }
    
    if (targetConditions.length === 0) {
        return { items: [], meta: { totalItems: 0, itemCount: 0, itemsPerPage: limit, totalPages: 0, currentPage: page } };
    }

    const whereCondition = or(...targetConditions);
    
    const subQuery = this.db.select({ id: noticeTargets.noticeId }).from(noticeTargets).where(and(eq(noticeTargets.noticeId, notices.id), whereCondition));
    
    const paginatedNotices = await this.db.query.notices.findMany({
        where: exists(subQuery),
        with: { author: { columns: { name: true, type: true } } },
        orderBy: [desc(notices.createdAt)],
        limit: limit,
        offset: (page - 1) * limit,
    });
    
    const totalResult = await this.db.select({ value: count() }).from(notices).where(exists(subQuery));
    const totalItems = totalResult[0].value;

    return {
      items: paginatedNotices,
      meta: {
        totalItems,
        itemCount: paginatedNotices.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }
   async findOneById(id: number) {
    // Drizzle의 관계형 쿼리를 사용하여 공지 및 관련 정보를 함께 조회합니다.
    const notice = await this.db.query.notices.findFirst({
      where: eq(notices.id, id),
      with: {
        // 작성자 정보 포함 (이름과 타입만 선택)
        author: {
          columns: {
            name: true,
            type: true,
          },
        },
        // 공지 대상 정보 포함
        targets: true,
      },
    });

    // 만약 해당 ID의 공지가 없다면 404 에러
    if (!notice) {
      throw new NotFoundException('공지를 찾을 수 없습니다.');
    }

    return notice;
  }
}