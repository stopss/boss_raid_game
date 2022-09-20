import { Body, Controller, Post } from '@nestjs/common';
import { UserInputDto } from './dto/user.input.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() userInputDto: UserInputDto): Promise<any> {
    return this.userService.createUser(userInputDto);
  }
}
