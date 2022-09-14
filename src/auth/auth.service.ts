import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validate(name: string, password: string) {
    let user: User;

    try {
      user = await this.userService.findOne(name);
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
