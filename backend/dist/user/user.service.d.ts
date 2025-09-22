import { HashService } from 'src/common/hash.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    private prisma;
    private hashService;
    constructor(prisma: PrismaService, hashService: HashService);
    createUser(dto: CreateUserDto): Promise<any>;
    findByUserName(userName: string): Promise<any>;
}
