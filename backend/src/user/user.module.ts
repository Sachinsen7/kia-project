import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';
import { UserService } from './user.service';

@Module({
  imports:[PrismaModule, CommonModule],
  providers:[UserService],
  controllers: [UserController],
  exports:[UserService],
})
export class UserModule {}
