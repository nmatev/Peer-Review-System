import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from "typeorm";
import { Team } from "./team";
import { User } from "./user";
import { WorkItem } from "./work-item";
import { ReviewVoteStatus } from "../../common/enums/review-vote-status";

@Entity('review_votes')
export class ReviewVotes {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ReviewVoteStatus,
    })
    state: ReviewVoteStatus;

    @CreateDateColumn()
    createdOn: Date;

    @ManyToOne(type => User, user => user.reviewVotes)
    author: Promise<User>;

    @ManyToOne(type => WorkItem, workItem => workItem.reviewVotes)
    workItem: Promise<WorkItem>;
}
