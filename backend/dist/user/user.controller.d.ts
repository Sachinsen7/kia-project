import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    register(dto: CreateUserDto): Promise<any>;
}
