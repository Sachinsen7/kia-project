import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { HashService } from 'src/common/hash.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService,
        private hashService: HashService
    ){}

    async createUser(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.userName },
    });

    if (existingUser) {
      throw new ConflictException('Username already taken');
    }

    const hashedPassword = await this.hashService.hashPassword(dto.password);

    return this.prisma.user.create({
      data: {
        username: dto.userName,
        password: hashedPassword,
      },
    });
  }

  async findByUserName(userName: string) {
    const user = await this.prisma.user.findUnique({
        where: {
            username: userName,
        }
    })

    if(!user) throw new NotFoundException('Id witht eh said userName does not exist');

    return user;
  }
}
