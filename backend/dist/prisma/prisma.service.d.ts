import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
