import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport'; // AuthGuard 
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { MyProfileResponseDto } from './dto/my-profile-response.dto'; 



@ApiTags('Auth (인증)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '이메일과 비밀번호로 로그인하여 JWT 액세스 토큰을 발급받습니다.' })
  @ApiResponse({ status: 201, description: '로그인 성공 및 토큰 발급' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt')) 
  @ApiBearerAuth() 
  @ApiOperation({ summary: '내 정보 조회', description: '현재 로그인된 사용자의 정보와 프로필을 조회합니다.' })
    @ApiResponse({ 
    status: 200, 
    description: '내 정보 조회 성공', 
    type: MyProfileResponseDto, // 2. 응답 타입을 지정합니다.
  })
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  async getMyProfile(@Req() req: Request) {
    // req.user는 JwtStrategy의 validate 메소드가 반환한 값
    const user = req.user as { userId: number; email: string };
    return this.authService.getMyProfile(user.userId);
  }
}