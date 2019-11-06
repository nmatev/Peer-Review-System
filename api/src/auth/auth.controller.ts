import { Controller, Post, Body, ValidationPipe, UseGuards, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO, RegisterUserDTO } from '../models/index';
import { FindUserGuard, IsUserRegistered } from '../common/guards/index';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../common/enums/user-role.enum';
import { Roles, UserDec } from '../common/decorators';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post()
    @UseGuards(IsUserRegistered)
    async register(@Body(new ValidationPipe({ transform: true, whitelist: true })) user: RegisterUserDTO): Promise<object> {
        return await this.authService.register(user);
    }

    @Post('session')
    @UseGuards()
    async login(@Body(new ValidationPipe({ transform: true, whitelist: true })) user: UserLoginDTO): Promise<object | boolean> {
        return await this.authService.login(user);
    }

    @Post('create-admin/:userId')
    @UseGuards(AuthGuard())
    async createAdmin(
        @UserDec() loggedUser: any,
        @Param('userId') userId: string,
    ) {
        return await this.authService.createAdmin(loggedUser, userId);
    }
}
