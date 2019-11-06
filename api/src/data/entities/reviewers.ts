import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Team } from "./team";
import { User } from "./user";
import { WorkItem } from "./work-item";

@Entity('reviewers')
export class Reviewers {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @ManyToOne(type => Team, team => team.members)
    // team: Promise<Team>;

    // @ManyToOne(type => User, user => user.teams)
    // member: Promise<User>;

    @ManyToOne(type => User, user => user.reviewingWorkItems)
    reviewers: Promise<User>;

    @ManyToOne(type => WorkItem, workItem => workItem.reviewers)
    workItem: Promise<WorkItem>;
}
