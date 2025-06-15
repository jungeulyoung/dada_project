import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
  if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false, // 만료된 토큰은 거부
      secretOrKey: secret // .env 파일의 비밀키
    });
  }

  // AuthGuard가 실행될 때 이 validate 메소드가 자동으로 호출됨
  // 토큰이 유효하면 payload를 그대로 반환
  async validate(payload: any) {
    return { userId: payload.userId, email: payload.email };
  }
}