import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsIn, IsNumber } from 'class-validator';

class NoticeTargetDto {
  @ApiProperty({ 
    description: '공지 대상 타입', 
    enum: ['ORGANIZATION', 'CLASS', 'SECTION'],
    example: 'ORGANIZATION',
  })
  @IsIn(['ORGANIZATION', 'CLASS', 'SECTION'])
  type: 'ORGANIZATION' | 'CLASS' | 'SECTION';

  @ApiProperty({ 
    description: '대상 ID',
    example: 1,
  })
  @IsNumber()
  id: number;
}

export class CreateNoticeDto {
  @ApiProperty({ 
    description: '공지 제목', 
    example: '중요 공지사항입니다.' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    description: '공지 내용', 
    example: '다음 주 월요일은 학원 전체 휴원입니다.' 
  })
  @IsString()
  content: string;

  @ApiProperty({ 
    description: '공지 대상 목록',
    type: [NoticeTargetDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NoticeTargetDto)
  targets: NoticeTargetDto[];
}