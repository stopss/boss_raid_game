import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { BossraidService } from './bossraid.service';
import { BossraidStartDto } from './dto/bossraid.start.dto';

@Controller('api/bossRaid')
export class BossraidController {
  constructor(private readonly bossRaidService: BossraidService) {}

  @Post('enter')
  start(@Body() bossraidStartDto: BossraidStartDto): Promise<any> {
    return this.bossRaidService.start(bossraidStartDto);
  }

  @Get()
  status(): Promise<any> {
    return this.bossRaidService.status();
  }

  @Patch('end')
  end(
    @Body('userId') userId: number,
    @Body('raidRecordId') raidRecordId: number,
  ): Promise<any> {
    return this.bossRaidService.end(userId, raidRecordId);
  }

  @Get('topRankerList')
  rankerList(@Body('userId') userId: number): Promise<any> {
    return this.bossRaidService.rankerList(userId);
  }
}
