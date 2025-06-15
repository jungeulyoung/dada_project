import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule], // DbModule을 import하여 DB Provider를 사용할 수 있게 함
  providers: [SeedService],
})
export class SeedModule {}