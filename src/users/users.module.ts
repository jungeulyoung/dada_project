import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DbModule } from 'src/db/db.module'; // DbModule을 import 합니다.

@Module({
  imports: [DbModule], // DbModule을 가져와서 DbProvider를 사용할 수 있게 합니다.
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}