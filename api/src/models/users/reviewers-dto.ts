import { IsEmail, IsString } from 'class-validator';

export class ReviewersDTO {
    @IsString()
    reviewers: string;

    @IsString()
    workItem: string;
}
