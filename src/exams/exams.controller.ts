import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { Request } from 'express';

@ApiTags('Exams (시험)')
@ApiBearerAuth()
@Controller('exams')
@UseGuards(AuthGuard('jwt'))
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @ApiOperation({ summary: '시험 생성', description: '새로운 시험 정보를 생성합니다. (교사 권한 필요)'})
  async createExam(
    @Body() createExamDto: CreateExamDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number };
    return this.examsService.createExam(user.userId, createExamDto);
  }
}