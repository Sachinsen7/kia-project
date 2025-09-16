import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { HashService } from 'src/common/hash.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private hashService: HashService
    ){}

    async create(dto: CreateUserDto){
      const hashed = await this.hashService.hashPassword(dto.password);
      return this.prisma.user.create({
        data:{
          email: dto.email,
          password: hashed,
          title: dto.title,
          firstName: dto.firstName,
          lastName: dto.lastName,
          region: dto.region,
          country: dto.country,
          nationality: dto.nationality,
          privacyPolicy: dto.privacyPolicy,
          cookiesPolicy: dto.cookiesPolicy,
        },
      });
    }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
        where: {
            email: email,
        }
    })

    if(!user) throw new NotFoundException('Id witht the said userName does not exist');

    return user;
  }
}
