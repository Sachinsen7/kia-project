import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/common/hash.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    private hashService;
    constructor(userService: UserService, jwtService: JwtService, hashService: HashService);
    validateUser(username: string, password: string): Promise<any>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            createdAt: any;
        };
    }>;
}
