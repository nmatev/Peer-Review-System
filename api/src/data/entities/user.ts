import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinTable,
    ManyToMany,
    CreateDateColumn,
    OneToOne,
    ManyToOne,
} from "typeorm";
import { Team } from "./team";
import { WorkItem } from "./work-item";
import { Comment } from "./comment";
import { Role } from "./role";
import { Members } from "./members";
import { ReviewVotes } from "./review-votes";
import { ReviewRequest } from "./review-request";
import { Notification } from "./notification";
import { Invitation } from "./invitation";
import { Inbox } from "./inbox";
import { Reviewers } from "./reviewers";
import { Message } from "./messages";
import { File } from "./files";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdOn: Date;

    @OneToOne(type => Inbox, inbox => inbox.user)
    inbox: Promise<Inbox>;

    @OneToMany(type => ReviewRequest, reviewRequest => reviewRequest.author)
    reviewRequests: Promise<ReviewRequest[]>;

    @OneToMany(type => Team, team => team.author)
    createdTeam: Promise<Team[]>;

    @OneToMany(type => Members, members => members.member)
    teams: Promise<Team[]>;

    @OneToMany(type => WorkItem, workItem => workItem.assignee)
    workItems: Promise<WorkItem[]>;

    @OneToMany(type => Reviewers, reviewers => reviewers.reviewers)
    reviewingWorkItems: Promise<WorkItem[]>;

    @OneToMany(type => Comment, comment => comment.author)
    comments: Promise<Comment[]>;

    @OneToMany(type => ReviewVotes, reviewVotes => reviewVotes.author)
    reviewVotes: Promise<ReviewVotes[]>;

    @OneToMany(type => Invitation, invitation => invitation.user)
    invitations: Promise<Invitation[]>;

    @OneToMany(type => Message, message => message.receiver)
    receivingMessages: Promise<Message[]>;

    @OneToMany(type => Message, message => message.sender)
    sendingMessages: Promise<Message[]>;

    // @OneToMany(type => File, file => file.author)
    // files: Promise<File[]>;

    @ManyToMany(type => Role, { eager: true })
    @JoinTable()
    roles: Role[];
}
