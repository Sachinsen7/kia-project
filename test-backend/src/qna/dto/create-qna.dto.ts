import { IsNotEmpty, IsString } from "class-validator";


export class CreateQnaDto{
    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsNotEmpty()
    heading: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}