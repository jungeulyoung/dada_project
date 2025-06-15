import { ApiProperty } from '@nestjs/swagger';

// 응답 DTO에 포함될 조직 정보
class OrganizationDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '다다에듀 대치점' })
  name: string;
}

// 응답 DTO에 포함될 프로필 정보
class ProfileDto {
  @ApiProperty({ example: 10 })
  id: number;

  @ApiProperty({ example: '김학생' })
  name: string;
  
  @ApiProperty({ example: 'STUDENT' })
  type: string;

  @ApiProperty({ type: OrganizationDto }) // 객체 타입을 명시
  organization: OrganizationDto;
}

// 최종 응답 형태를 정의하는 DTO
export class MyProfileResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'student@example.com' })
  email: string;

  @ApiProperty({ type: [ProfileDto] }) // 배열 타입 명시
  profiles: ProfileDto[];
}