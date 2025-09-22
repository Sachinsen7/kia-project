import { IsOptional, IsString } from "class-validator";


export class UpdateQnaDto{
    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    heading?: string;

    @IsString()
    @IsOptional()
    description?: string;
}