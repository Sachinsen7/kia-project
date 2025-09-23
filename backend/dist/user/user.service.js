"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const hash_service_1 = require("../common/hash.service");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    prisma;
    hashService;
    constructor(prisma, hashService) {
        this.prisma = prisma;
        this.hashService = hashService;
    }
<<<<<<< HEAD
    async createUser(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { username: dto.userName },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username already taken');
        }
        const hashedPassword = await this.hashService.hashPassword(dto.password);
        return this.prisma.user.create({
            data: {
                username: dto.userName,
                password: hashedPassword,
            },
        });
    }
    async findByUserName(userName) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: userName,
            }
        });
        if (!user)
            throw new common_1.NotFoundException('Id witht eh said userName does not exist');
=======
    async create(dto) {
        const hashed = await this.hashService.hashPassword(dto.password);
        return this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashed,
                title: dto.title,
                firstName: dto.firstName,
                lastName: dto.lastName,
                region: dto.region,
                country: dto.country,
                nationality: dto.nationality,
                privacyPolicy: dto.privacyPolicy,
                cookiesPolicy: dto.cookiesPolicy,
            },
        });
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            }
        });
        if (!user)
            throw new common_1.NotFoundException('Id witht the said userName does not exist');
>>>>>>> cbef98c8a99a9f1ee3f000af5f94e4f72c7da5f9
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        hash_service_1.HashService])
], UserService);
//# sourceMappingURL=user.service.js.map