import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ThreatsController } from './threats.controller';
import { ThreatsService } from './threats.service';

@Module({
  imports: [HttpModule],
  controllers: [ThreatsController],
  providers: [ThreatsService],
  exports: [ThreatsService],
})
export class ThreatsModule {}
