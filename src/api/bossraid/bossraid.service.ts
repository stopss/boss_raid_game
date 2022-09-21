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

  /**
   * 보스레이드 상태조회
   * @returns {boolean} canEnter - 입장 가능한지
   * @returns {boolean} enteredUserId - 입장한 유저의 id
   */
  async status(): Promise<any> {
    // 보스레이드 시작한 기록이 있는지 확인
    const raidRecord = await this.raidRecordRepository.find({
      where: { status: true },
    });

    // 보스레이드 시작한 기록이 없다면
    if (raidRecord.length === 0) {
      return Object.assign({
        success: true,
        statusCode: 200,
        data: { canEnter: true },
        message: '보스레이드를 입장 가능합니다.',
        timestamp: new Date().toISOString(),
      });
    }

    // 보스레이드 시작한 기록이 있다면
    // 시작한 시간으로부터 레이드 경과시간(3분)만큼 경과되어야 함
    const enterTime = raidRecord[0].enterTime.getTime();
    const date = new Date().getTime();
    const elapsedTime = (date - enterTime) / 1000;

    // 시간(3분)이 경과 되지 않았다면
    if (elapsedTime < 180) {
      return Object.assign({
        success: false,
        statusCode: 200,
        data: { canEnter: false, enteredUserId: raidRecord[0].enteredUserId },
        message: '보스레이드를 입장 불가능합니다.',
        timestamp: new Date().toISOString(),
      });
    }

    // 시간(3분)이 경과되었다면
    await this.raidRecordRepository.update(
      {
        raidRecordId: raidRecord[0].raidRecordId,
      },
      { status: false },
    );
    
    return Object.assign({
      success: true,
      statusCode: 200,
      data: { canEnter: true},
      message: '보스레이드를 입장 가능합니다.',
      timestamp: new Date().toISOString(),
    });
  }
}
