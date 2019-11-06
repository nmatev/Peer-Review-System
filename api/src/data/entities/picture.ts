import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user';
import { WorkItem } from './work-item';

@Entity('pictures')
export class Picture {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fileName: string;

    @CreateDateColumn()
    createdOn: Date;

    @Column()
    userId: string;

    @Column()
    filePath: string;
}
