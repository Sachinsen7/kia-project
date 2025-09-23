import { HashService } from 'src/common/hash.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    private prisma;
    private hashService;
    constructor(prisma: PrismaService, hashService: HashService);
<<<<<<< HEAD
    createUser(dto: CreateUserDto): Promise<any>;
    findByUserName(userName: string): Promise<any>;
=======
    create(dto: CreateUserDto): Promise<{
        password: string;
        id: string;
        username: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        password: string;
        id: string;
        username: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
>>>>>>> cbef98c8a99a9f1ee3f000af5f94e4f72c7da5f9
}
