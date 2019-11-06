import { IsString } from "class-validator";

export class WorkItemVoteDTO {
    @IsString()
    state: string;
}
