import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/common/hash.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    private hashService;
    constructor(userService: UserService, jwtService: JwtService, hashService: HashService);
    validateUser(email: string, password: string): Promise<{
        password: string;
        id: string;
        username: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: any;
            firstName: any;
            lastName: any;
            approved: any;
            role: any;
        };
    }>;
}
