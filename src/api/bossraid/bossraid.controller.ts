import { Body, Controller, Post } from '@nestjs/common';
import { BossraidService } from './bossraid.service';
import { BossraidStartDto } from './dto/bossraid.start.dto';

@Controller('api/bossRaid')
export class BossraidController {
  constructor(private readonly bossRaidService: BossraidService) {}

  @Post('enter')
  start(@Body() bossraidStartDto: BossraidStartDto): Promise<any> {
    return this.bossRaidService.start(bossraidStartDto);
  }
}
