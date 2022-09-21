import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BossraidStartDto } from './dto/bossraid.start.dto';
import { RaidReocrdEntity } from './entities/raidRecord.entity';

@Injectable()
export class BossraidService {
  constructor(
    @InjectRepository(RaidReocrdEntity)
    private readonly raidRecordRepository: Repository<RaidReocrdEntity>,
  ) {}

  /**
   * 보스레이드 시작 API
   * @param bossraidStartDto
   * @returns {boolean} isEntered - 시작 성공 여부
   * @returns {boolean} raidRecordId - raidRecordId(PK)
   */
  async start(bossraidStartDto: BossraidStartDto): Promise<any> {
    try {
      // 보스레이드 시작한 기록이 있는지 확인
      const status = await this.raidRecordRepository.find({
        where: { status: true },
      });

      // 보스레이드 시작한 기록이 있다면,
      if (status.length !== 0) {
        return Object.assign({
          success: false,
          statusCode: 200,
          data: { isEntered: false },
          message: '보스레이드를 시작할 수 없습니다.',
          timestamp: new Date().toISOString(),
        });
      }

      // 보스레이드 시작한 기록이 없다면,
      const { userId, level } = bossraidStartDto;

      const raidRecord = this.raidRecordRepository.create({
        enteredUserId: userId,
        level,
      });
      await this.raidRecordRepository.save(raidRecord);

      return Object.assign({
        success: true,
        statusCode: 201,
        data: { isEntered: true, raidRecordId: raidRecord.raidRecordId },
        message: '보스레이드를 시작합니다.',
        timestamp: new Date().toISOString(),
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }
}
