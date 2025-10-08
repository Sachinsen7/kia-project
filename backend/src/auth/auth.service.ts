import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/common/hash.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private hashService: HashService
    ) {}

    async validateUser(username: string, password: string){
        const user = await this.userService.findByUserName(username);
        if(!user) throw new NotFoundException('User not found');

        const isPasswordValid = await this.hashService.verifyPassword(user.password, password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return user;
    }

    async login(dto: LoginDto) {
    const user = await this.validateUser(dto.userName, dto.password);

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
    };
  }
}
