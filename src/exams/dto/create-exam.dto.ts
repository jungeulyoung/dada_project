import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional, IsDecimal } from 'class-validator';

export class CreateExamDto {
  @ApiProperty({ description: '시험이 속한 수업(class)의 ID', example: 1 })
  @IsNumber()
  classId: number;

  @ApiProperty({ description: '시험 이름', example: '1학기 중간고사' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '시험 날짜', example: '2025-09-15' })
  @IsDateString()
  examDate: string;

  @ApiProperty({ description: '시험 총점', example: '100.00', required: false })
  @IsOptional()
  @IsString() // IsDecimal은 class-validator에 없으므로, 문자열로 받고 서비스에서 변환하거나 IsNumber 사용
  totalScore?: string;

  @ApiProperty({ description: '전체 학생에게 보여줄 공통 코멘트', required: false })
  @IsString()
  @IsOptional()
  commonComment?: string;
}