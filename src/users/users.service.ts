import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DB, DBType } from '../db/db.provider';
import { profiles, users } from '../schema/users'; // profiles도 import
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject(DB) private db: DBType) {}

  async findOneByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }

  async findUserWithProfilesById(userId: number) {
    // Drizzle의 관계형 쿼리(with) 사용
    const [userWithProfiles] = await this.db.query.users.findMany({
      where: eq(users.id, userId),
      with: {
        // users schema에 정의된 profiles 관계를 함께 조회
        profiles: {
          with: {
            organization: true // 프로필의 소속 조직 정보도 함께 조회
          }
        }
      },
      limit: 1,
    });

    if (!userWithProfiles) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    
    // 보안을 위해 비밀번호 필드 제거
    const { password, ...result } = userWithProfiles;
    return result;
  }
}