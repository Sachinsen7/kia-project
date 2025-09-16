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

    async validateUser(email: string, password: string){
      const user = await this.userService.findByEmail(email);

      if(!user) throw new NotFoundException('Invalid credentials');

      const isPasswordValid = await this.hashService.verifyPassword(user.password, password);

      if(!isPasswordValid)  throw new UnauthorizedException('Invalid credentials');

      return user;
    }

  }
