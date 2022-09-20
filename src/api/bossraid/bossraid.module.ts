import { Module } from '@nestjs/common';
import { BossraidService } from './bossraid.service';
import { BossraidController } from './bossraid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaidReocrdEntity } from './entities/bossraid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RaidReocrdEntity])],
  providers: [BossraidService],
  controllers: [BossraidController],
})
export class BossraidModule {}
