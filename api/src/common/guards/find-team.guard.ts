import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Team } from '../../data/entities/index';
@Injectable()
export class FindTeamGuard implements CanActivate {
    constructor(
        @InjectRepository(Team) private readonly teamRepo: Repository<Team>) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const teamId = request.params.teamId;
        const foundTeam = await this.teamRepo.findOne({ id: teamId });

        if (!foundTeam) {
            throw new NotFoundException(`Team with id '${teamId}' does not exist!`);
        }

        return true;
    }
}
