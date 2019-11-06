import { Length, IsEmail, IsString, IsArray, IsOptional } from 'class-validator';
import { Team } from '../../data/entities';

export class WorkItemDTO {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    comments: string;

    @IsArray()
    reviewers: any;

    @IsString()
    teamId: string;
}
