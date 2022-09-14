import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashSync(createUserDto.password, 10),
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({});
  }

  async findOne(name: string) {
    return await this.prisma.user.findFirstOrThrow({
      where: { name },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    return await this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
  }
}
