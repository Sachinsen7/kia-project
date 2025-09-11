import {IsString, MaxLength, MinLength} from 'class-validator'

export class CreateUserDto{
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    userName: string;

    @IsString()
    @MinLength(6)
    @MaxLength(30)
    password: string
}