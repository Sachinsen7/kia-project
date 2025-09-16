import { IsEmail, IsString, MinLength } from "class-validator";


export class LoginDto{
    @IsEmail()
    userName: string;

    @IsString()
    @MinLength(8)
    password: string;
}