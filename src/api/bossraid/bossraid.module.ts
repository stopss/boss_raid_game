import { Module } from '@nestjs/common';
import { BossraidService } from './bossraid.service';
import { BossraidController } from './bossraid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaidReocrdEntity } from './entities/raidRecord.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RaidReocrdEntity, UserEntity])],
  providers: [BossraidService],
  controllers: [BossraidController],
})
export class BossraidModule {}
