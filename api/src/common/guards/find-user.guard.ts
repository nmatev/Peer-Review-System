import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../data/entities/index';
@Injectable()
export class FindUserGuard implements CanActivate {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.params.userId;

        const found = await this.userRepo.findOne({ id: userId });

        if (!found) {
            throw new NotFoundException(`User with id '${userId}' does not exist!`);
        }

        return true;
    }
}
