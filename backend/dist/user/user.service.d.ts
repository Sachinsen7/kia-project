import { HashService } from 'src/common/hash.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    private prisma;
    private hashService;
    constructor(prisma: PrismaService, hashService: HashService);
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
}
