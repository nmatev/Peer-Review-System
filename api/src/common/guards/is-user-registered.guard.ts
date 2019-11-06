import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../data/entities/index';

@Injectable()
export class IsUserRegistered implements CanActivate {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userEmail = request.body.email;
        const found = await this.userRepo.findOne({ email: userEmail });

        if (!!found) {
            throw new NotFoundException(`User with email '${userEmail}' already exists!`);
        }
        return true;
    }
}
