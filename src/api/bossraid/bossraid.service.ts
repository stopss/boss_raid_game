import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { BossraidStartDto } from './dto/bossraid.start.dto';
import { RaidReocrdEntity } from './entities/raidRecord.entity';

@Injectable()
export class BossraidService {
  constructor(
    @InjectRepository(RaidReocrdEntity)
    private readonly raidRecordRepository: Repository<RaidReocrdEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
      data: { canEnter: true },
      message: '보스레이드를 입장 가능합니다.',
      timestamp: new Date().toISOString(),
    });
  }

  // 보스레이드 종료
  async end(userId: number, raidRecordId: number): Promise<any> {
    // userId가 존재하지 않는 경우
    const user = this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(
        Object.assign({
          success: false,
          statusCode: 404,
          message: 'Not Found userId',
          timestamp: new Date().toISOString(),
        }),
      );
    }

    // userId와 raidRecordId가 일치하지 않은 경우
    const raidRecord = await this.raidRecordRepository.findOne({
      where: { raidRecordId },
    });

    if (raidRecord.enteredUserId != userId) {
      return Object.assign({
        success: false,
        statusCode: 400,
        data: {},
        message: '해당 레이드 기록이 없습니다.',
        timestamp: new Date().toISOString(),
      });
    }

    // raidRecordId가 존재하지 않는 경우
    if (!raidRecord) {
      throw new NotFoundException(
        Object.assign({
          success: false,
          statusCode: 404,
          message: 'Not Found raidRecordId',
          timestamp: new Date().toISOString(),
        }),
      );
    }

    // 해당 레이드가 이미 종료된 경우
    if (raidRecord.status === false) {
      return Object.assign({
        success: true,
        statusCode: 200,
        data: {},
        message: '해당 레이드는 이미 종료되었습니다.',
        timestamp: new Date().toISOString(),
      });
    }

    // 시작한 시간으로부터 시간(3분)이 경과한 경우
    const enterTime = raidRecord.enterTime.getTime();
    const date = new Date().getTime();
    const elapsedTime = (date - enterTime) / 1000;

    const level = Number(raidRecord.level);
    let score = 0;
    if (level === 1) score = 20;
    else if (level === 2) score = 47;
    else score = 85;

    const totalScore = (await user).totalScore + score;
    console.log((await user).totalScore);

    if (elapsedTime > 180 || raidRecord.status === true) {
      // status: false로 변경
      await this.raidRecordRepository.update(raidRecordId, {
        status: false,
        score,
      });

      // 해당 user에 totalScore 업데이트
      await this.userRepository.update(userId, { totalScore: totalScore });

      return Object.assign({
        success: true,
        statusCode: 200,
        data: {},
        message: '해당 레이드가 종료되었습니다.',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 랭킹 조회
  async rankerList(userId: number): Promise<any> {
    // const topRankerList = await this.userRepository.find({
    //   order: { totalScore: 'DESC' },
    // });

    const topRankerList = await this.userRepository
      .createQueryBuilder('users')
      .select(['userId, totalScore'])
      .orderBy('totalScore', 'DESC')
      .addSelect('@ROWNUM := @ROWNUM + 1 AS "ranker"')
      .where('(@ROWNUM := 0) = 0')
      .getRawMany();

    const myRankingInfo = await this.userRepository
      .createQueryBuilder('users')
      .select(['userId, totalScore'])
      .orderBy('totalScore', 'DESC')
      .addSelect('@ROWNUM := @ROWNUM + 1 AS "ranker"')
      .where('(@ROWNUM := 0) = 0')
      .andWhere('userId = :userId', { userId })
      // .whereInIds(userId)
      .getRawMany();

    return Object.assign({
      success: true,
      statusCode: 200,
      data: { topRankerList, myRankingInfo },
      message: '랭킹 조회가 완료되었습니다.',
      timestamp: new Date().toISOString(),
    });
  }
}
