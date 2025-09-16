import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: CreateUserDto){
        const user= await this.userService.create(dto);
        return{
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            approved: user.approved,
            role: user.role,
        }
    }
}
