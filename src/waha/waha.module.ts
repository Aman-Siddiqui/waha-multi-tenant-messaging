import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WahaSession } from './waha-session.entity';
import { WahaService } from './waha.service';
import { WahaSessionsService } from './waha-sessions.service';
import { WahaController } from './waha.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WahaSession])],
  controllers: [WahaController],
  providers: [WahaService, WahaSessionsService],
  exports: [WahaSessionsService],
})
export class WahaModule {}
