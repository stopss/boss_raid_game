import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserInputDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
