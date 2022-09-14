import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
