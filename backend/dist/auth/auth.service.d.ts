import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/common/hash.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    private hashService;
    constructor(userService: UserService, jwtService: JwtService, hashService: HashService);
<<<<<<< HEAD
    validateUser(username: string, password: string): Promise<any>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            createdAt: any;
=======
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
>>>>>>> cbef98c8a99a9f1ee3f000af5f94e4f72c7da5f9
        };
    }>;
}
