import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, OneToMany, CreateDateColumn, OneToOne } from 'typeorm';
import { Comment } from './comment';
import { User } from './user';
import { ReviewVotes } from './review-votes';
import { ReviewRequest } from './review-request';
import { Team } from './team';
import { Reviewers } from './reviewers';
@Entity('work_items')
export class WorkItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    tags: string;

    @Column()
    status: string;

    @CreateDateColumn()
    createdOn: Date;

    @OneToMany(type => ReviewRequest, reviewRequest => reviewRequest.workItem)
    reviewRequests: Promise<ReviewRequest[]>;

    @OneToMany(type => Comment, comment => comment.workItem)
    comments: Promise<Comment[]>;

    @OneToMany(type => ReviewVotes, reviewVotes => reviewVotes.workItem)
    reviewVotes: Promise<ReviewVotes[]>;

    @OneToMany(type => Reviewers, reviewers => reviewers.workItem)
    reviewers: Promise<User[]>;

    @ManyToOne(type => User, user => user.workItems)
    assignee: Promise<User>;

    @ManyToMany(type => Team, team => team.workItems)
    @JoinTable()
    teams: Promise<Team[]>;
}
