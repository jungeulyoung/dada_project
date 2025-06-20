import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from './seed/seed.module';
import { DbModule } from './db/db.module'; // DbModule import
import { NoticesModule } from './notices/notices.module';
import { ExamsModule } from './exams/exams.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // .env 파일을 전역으로 사용
    }),
    AuthModule,
    UsersModule,
    SeedModule,
    DbModule,
    NoticesModule,
    ExamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}