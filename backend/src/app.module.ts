import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { QnaModule } from './qna/qna.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, CommonModule, QnaModule],
})
export class AppModule {}
