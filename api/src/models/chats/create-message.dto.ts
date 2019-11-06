import { Length, IsEmail, IsString } from 'class-validator';

export class CreateMessageDTO {
    @Length(3, 50)
    name: string;

    @IsString()
    receiver: string;

    @IsString()
    message: string;
}
