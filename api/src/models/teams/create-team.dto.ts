import { Length, IsEmail, IsString } from 'class-validator';

export class CreateTeamDTO {
    @IsString()
    name: string;
}
