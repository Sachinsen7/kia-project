import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    register(dto: CreateUserDto): Promise<{
        id: string;
        email: any;
        firstName: any;
        lastName: any;
        approved: any;
        role: any;
    }>;
}
