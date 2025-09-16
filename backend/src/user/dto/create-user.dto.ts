import {IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from 'class-validator'

export class CreateUserDto{
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    title: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastNamt: string;

    @IsString()
    region: string;

    @IsString()
    country: string;

    @IsString()
    nationality: string;

    @IsBoolean()
    privacyPolicy: boolean;

    @IsBoolean()
    cookiesPolicy: boolean;
}