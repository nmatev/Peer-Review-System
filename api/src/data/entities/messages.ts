import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, OneToOne, JoinColumn, ManyToMany } from "typeorm";
import { Team } from "./team";
import { User } from "./user";
import { Notification } from "./notification";
import { Invitation } from "./invitation";
import { Chat } from "./chat";

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdOn: Date;

    @Column()
    message: string;

    @ManyToOne(type => User, user => user.receivingMessages)
    receiver: Promise<User>;

    @ManyToOne(type => User, user => user.sendingMessages)
    sender: Promise<User>;

    @ManyToOne(type => Chat, chat => chat.messages)
    chat: Promise<Chat>;
}
