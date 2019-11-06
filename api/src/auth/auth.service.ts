import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../data/entities/index';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../common/enums/user-role.enum';
import { Role } from '../data/entities/role';
import { UserLoginDTO, ReturnUserDTO, RegisterUserDTO } from '../models/index';
import { Inbox } from '../data/entities/inbox';
@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
        @InjectRepository(Inbox) private readonly inboxRepo: Repository<Inbox>,
        private readonly jwtService: JwtService,
    ) { }

    async validateUserIfExist(payload: any) {
        return await this.userRepo.findOne({
            where: {
                email: payload.email,
            },
        });
    }

    async register(user: RegisterUserDTO): Promise<object> {
        const basicRole = await this.rolesRepo.findOne({
            where: {
                name: UserRole.Basic,
            },
        });
        const userToSave = await {
            ...user, password: await bcrypt.hash(user.password, 10), roles: [basicRole],
        };
        const savedUser = await this.userRepo.save(userToSave);

        const inbox = new Inbox();
        inbox.user = Promise.resolve(savedUser);
        await this.inboxRepo.save(inbox);

        return {
            message: `Successfull registration, you are automatically logged in!`,
            user: plainToClass(ReturnUserDTO, savedUser, {
                excludeExtraneousValues: true,
            }),
        };
    }

    async login(user: UserLoginDTO): Promise<object | boolean> {
        const foundUser = await this.userRepo.findOne({ where: { email: user.email } });
        if (!foundUser) {
            throw new BadRequestException(`User with email '${user.email}' does not exist!`);
        }

        const result = await bcrypt.compare(user.password, foundUser.password);
        if (!result) {
            throw new BadRequestException(`Wrong credentials, try again!`);
        }

        const userRoles = await foundUser.roles;
        const displayUserRoles = userRoles.map((role) => role.name);
        const token = await this.jwtService.sign({ ...user });

        return {
            message: `You've logged in successfully!`,
            user: plainToClass(ReturnUserDTO, foundUser, {
                excludeExtraneousValues: true,
            }),
            role: displayUserRoles,
            token,
        };
    }

    async createAdmin(loggedUser: User, userId: string) {
        const foundLoggedUser: any = await this.userRepo.findOne({ id: loggedUser.id });

        const isAdmin = foundLoggedUser.roles.every(role => role.name.includes('Admin'));
        if (!isAdmin) {
            throw new UnauthorizedException(`You can't access this resource!`);
        }
        const foundUser = await this.userRepo.findOne({ id: userId });
        const basicRole = await this.rolesRepo.findOne({
            where: {
                name: UserRole.Admin,
            },
        });

        foundUser.roles = [basicRole];

        return await this.userRepo.save(foundUser);
    }
}
