import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from "typeorm";
import { Team } from "./team";
import { User } from "./user";
import { Inbox } from "./inbox";

@Entity('invitations')
export class Invitation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    status: boolean;

    @Column()
    notificationId: string;

    @CreateDateColumn()
    createdOn: Date;

    @ManyToOne(type => Inbox, inbox => inbox.invitations)
    inbox: Promise<Inbox>;

    @ManyToOne(type => Team, team => team.invitations)
    team: Promise<Team>;

    @ManyToOne(type => User, user => user.invitations)
    user: Promise<User>;
}
