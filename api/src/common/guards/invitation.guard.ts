import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from '../../data/entities/invitation';

@Injectable()
export class InvitationGuard implements CanActivate {
    constructor(
        @InjectRepository(Invitation) private readonly invitationRepo: Repository<Invitation>) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const invitationId = request.params.invitationId;
        const foundInvitation = await this.invitationRepo.findOne({ id: invitationId });

        if (!foundInvitation) {
            throw new NotFoundException(`Invitation with id ${foundInvitation} does not exist!`);
        }
        return true;
    }
}
