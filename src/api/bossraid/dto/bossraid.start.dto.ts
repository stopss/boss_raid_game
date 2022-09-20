import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BossraidStartDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  level: string;
}
