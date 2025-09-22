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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const hash_service_1 = require("../common/hash.service");
let AuthService = class AuthService {
    userService;
    jwtService;
    hashService;
    constructor(userService, jwtService, hashService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.hashService = hashService;
    }
<<<<<<< HEAD
    async validateUser(username, password) {
        const user = await this.userService.findByUserName(username);
        if (!user)
            throw new common_1.NotFoundException('User not found');
=======
    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('Invalid credentials');
>>>>>>> cbef98c8a99a9f1ee3f000af5f94e4f72c7da5f9
        const isPasswordValid = await this.hashService.verifyPassword(user.password, password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return user;
    }
    async login(dto) {
<<<<<<< HEAD
        const user = await this.validateUser(dto.userName, dto.password);
        const payload = { sub: user.id, username: user.username };
=======
        const user = await this.validateUser(dto.email, dto.password);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            approved: user.approved,
        };
>>>>>>> cbef98c8a99a9f1ee3f000af5f94e4f72c7da5f9
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
<<<<<<< HEAD
                username: user.username,
                createdAt: user.createdAt,
=======
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                approved: user.approved,
                role: user.role,
>>>>>>> cbef98c8a99a9f1ee3f000af5f94e4f72c7da5f9
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        hash_service_1.HashService])
], AuthService);
//# sourceMappingURL=auth.service.js.map