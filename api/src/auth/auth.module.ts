import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../data/entities/index';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { config } from '../common/config';
import { Role } from '../data/entities/role';
import { Inbox } from '../data/entities/inbox';
@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role, Inbox]),
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secretOrPrivateKey: config.jwtSecret,
                type: configService.dbType as any,
                host: configService.dbHost,
                port: configService.dbPort,
                username: configService.dbUsername,
                password: configService.dbPassword,
                database: configService.dbName,
                entities: ['./src/data/entities/*.ts'],
                signOptions: {
                    expiresIn: config.expiresIn, // one hour
                },
            }),
        }),

    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule { }
