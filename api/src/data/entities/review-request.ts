import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, OneToMany, CreateDateColumn, OneToOne } from 'typeorm';
import { Comment } from './comment';
import { User } from './user';
import { ReviewVotes } from './review-votes';
import { WorkItem } from './work-item';
@Entity('review_request')
export class ReviewRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdOn: Date;

    @ManyToOne(type => User, user => user.reviewRequests)
    author: Promise<User>;

    @ManyToOne(type => WorkItem, workItem => workItem.reviewRequests)
    workItem: Promise<WorkItem>;
}
