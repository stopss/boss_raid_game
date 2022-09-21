import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaidReocrdEntity } from '../bossraid/entities/raidRecord.entity';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RaidReocrdEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
