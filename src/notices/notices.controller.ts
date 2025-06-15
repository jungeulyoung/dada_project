import { Controller, Post, Body, UseGuards, Req, Get, Query, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto'; // PaginationDto import
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger'; 


@ApiTags('Notices (공지사항)') 
@ApiBearerAuth() 
@Controller('notices')
@UseGuards(AuthGuard('jwt')) 
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  @ApiOperation({ summary: '공지 생성', description: '새로운 공지를 생성합니다. (교사/관리자 권한 필요)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '성공적으로 생성됨' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증되지 않음' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '작성자 프로필을 찾을 수 없음' })
  async create(
    @Body() createNoticeDto: CreateNoticeDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number };
    return this.noticesService.createNotice(user.userId, createNoticeDto);
  }

  @Get()
  @ApiOperation({ summary: '내 공지 목록 조회', description: '로그인한 사용자가 볼 수 있는 공지 목록을 페이지네이션하여 조회합니다.' })
  @ApiResponse({ status: HttpStatus.OK, description: '조회 성공' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증되지 않음' })
  async findMyNotices(
    @Query() paginationDto: PaginationDto, // 쿼리 파라미터를 DTO로 받음
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number };
    return this.noticesService.findMyNotices(user.userId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '공지 상세 조회', description: '특정 ID를 가진 공지의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '공지의 고유 ID', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: '조회 성공' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증되지 않음' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '해당 ID의 공지를 찾을 수 없음' })
  async findOne(
    @Param('id', ParseIntPipe) id: number, // URL의 :id 파라미터를 숫자로 변환하여 가져옴
  ) {
    return this.noticesService.findOneById(id);
  }
}