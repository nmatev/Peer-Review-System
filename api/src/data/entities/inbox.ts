import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Team } from "./team";
import { User } from "./user";
import { Notification } from "./notification";
import { Invitation } from "./invitation";

@Entity('inboxes')
export class Inbox {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(type => User, user => user.inbox)
    @JoinColumn()
    user: Promise<User>;

    @OneToMany(type => Notification, notification => notification.inbox)
    notifications: Promise<Notification[]>;

    @OneToMany(type => Invitation, invitation => invitation.inbox)
    invitations: Promise<Invitation[]>;
}
