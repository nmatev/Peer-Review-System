import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./user";
import { Inbox } from "./inbox";
@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdOn: Date;

    @Column()
    message: string;

    @Column()
    isRead: boolean;

    @Column()
    type: string;

    @ManyToOne(type => Inbox, inbox => inbox.notifications)
    inbox: Promise<Inbox>;
}
