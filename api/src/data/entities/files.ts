import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user';
import { WorkItem } from './work-item';

@Entity('files')
export class File {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fileName: string;

    @Column()
    workItemId: string;

    @Column()
    teamId: string;

    @Column()
    userId: string;

    @Column()
    filePath: string;

    @CreateDateColumn()
    createdOn: Date;
}
