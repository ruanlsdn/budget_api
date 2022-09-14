import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserDecorator } from './decorators/user.decorator';

@ApiTags('Auth')
@Controller('api/v1/')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
  create(@UserDecorator() user: User) {
    return user;
  }
}
