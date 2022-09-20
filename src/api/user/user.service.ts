import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInputDto } from './dto/user.input.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * 유저를 생성한다.
   * @param {Object} userInputDto
   * @returns {boolean} success - 성공 여부
   * @returns {number} userId - userId(PK)
   */
  async createUser(userInputDto: UserInputDto): Promise<any> {
    try {
      const { email, password } = userInputDto;

      // 비밀번호 암호화 형태로 저장
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        email,
        password: hashedPassword,
      });

      await this.userRepository.save(user);

      return Object.assign({
        success: true,
        statusCode: 201,
        data: { userId: user.userId },
        message: '새로운 유저가 등록되었습니다.',
        timestamp: new Date().toISOString(),
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }

  // 유저 조회
  async getUser(userId: number): Promise<any> {
    const existUser = await this.userRepository.findOne({ where: { userId } });

    // userId가 없는 경우
    if (!existUser) {
      throw new NotFoundException(
        Object.assign({
          success: false,
          statusCode: 404,
          message: '해당 유저를 찾을 수 없습니다.',
          timestamp: new Date().toISOString(),
        }),
      );
    }

    return Object.assign({
      success: true,
      statusCode: 200,
      data: { totalScore: existUser.totalScore },
      message: '유저 정보 조회에 성공했습니다.',
      timestamp: new Date().toISOString(),
    });
  }
}
