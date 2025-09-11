import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: CreateUserDto){
        return this.userService.createUser(dto);
    }
}
