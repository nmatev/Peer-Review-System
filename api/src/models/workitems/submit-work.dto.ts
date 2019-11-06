import { IsEmail, IsString } from 'class-validator';

export class SubmitWorkDTO {
    @IsString()
    title: string;

    @IsString()
    description: string;
}
