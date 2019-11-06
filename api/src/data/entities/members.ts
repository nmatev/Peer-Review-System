import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Team } from "./team";
import { User } from "./user";

@Entity('members')
export class Members {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    isInTeam: boolean;

    @ManyToOne(type => Team, team => team.members)
    team: Promise<Team>;

    @ManyToOne(type => User, user => user.teams)
    member: Promise<User>;
}
