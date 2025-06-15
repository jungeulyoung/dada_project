import { Module } from '@nestjs/common';
import { DbProvider } from './db.provider';

@Module({
  providers: [DbProvider],
  exports: [DbProvider], // DbProvider를 다른 모듈에서 사용할 수 있도록 여기서 export 합니다.
})
export class DbModule {}