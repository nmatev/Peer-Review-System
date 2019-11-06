import { Length, IsEmail, IsString } from 'class-validator';

export class UserLoginDTO {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @Length(3, 20)
    password: string;
}
