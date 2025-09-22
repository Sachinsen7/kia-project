import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
<<<<<<< HEAD
            id: any;
            username: any;
            createdAt: any;
=======
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
