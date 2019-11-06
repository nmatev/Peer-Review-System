import { Length, IsEmail, IsString } from "class-validator";

export class RegisterUserDTO {
    @IsString()
    @Length(3, 20)
    name: string;

    @IsString()
    @Length(3, 10)
    password: string;

    @IsString()
    @IsEmail()
    email: string;
}
