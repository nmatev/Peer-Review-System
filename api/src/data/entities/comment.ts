import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user';
import { WorkItem } from './work-item';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdOn: Date;

    @ManyToOne(type => User, user => user.comments)
    author: Promise<User>;

    @ManyToOne(type => WorkItem, workItem => workItem.comments)
    workItem: Promise<WorkItem>;
}
