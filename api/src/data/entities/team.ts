import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
    ManyToOne,
    CreateDateColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { User } from './user';
import { Members } from './members';
import { WorkItem } from './work-item';
import { Invitation } from './invitation';

@Entity('teams')
export class Team {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @CreateDateColumn()
    createdOn: Date;

    @ManyToOne(type => User, user => user.createdTeam)
    author: Promise<User>;

    @OneToMany(type => Members, members => members.team)
    members: Promise<User[]>;

    @OneToMany(type => Invitation, invitation => invitation.team)
    invitations: Promise<Invitation[]>;

    @ManyToMany(type => WorkItem, workItem => workItem.teams)
    workItems: Promise<WorkItem[]>;
}
