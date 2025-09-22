import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
<<<<<<< HEAD
    register(dto: CreateUserDto): Promise<any>;
=======
    register(dto: CreateUserDto): Promise<{
        id: string;
        email: any;
        firstName: any;
        lastName: any;
        approved: any;
        role: any;
    }>;
>>>>>>> cbef98c8a99a9f1ee3f000af5f94e4f72c7da5f9
}
