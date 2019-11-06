import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Team } from '../../data/entities/index';
import { UserRole } from '../enums/user-role.enum';
@Injectable()
export class AdminAuthorGuard implements CanActivate {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // works with params teamId !!!!!
        const request = context.switchToHttp().getRequest();
        const teamId = request.params.teamId;
        const user = request.user;

        const foundTeam = await this.teamRepo.findOne({ id: teamId });
        const teamAuthor = await foundTeam.author;
        const isAuthorOfTheTeam = (user.id === teamAuthor.id);
        const isAdmin = user.roles[0].name === UserRole.Admin;

        if (isAdmin || isAuthorOfTheTeam) {
            return true;
        }

        throw new ForbiddenException(`You can't access or modify this resource.`);
    }
}
