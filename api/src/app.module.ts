import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { TeamsModule } from './teams/teams.module';
import { ChatModule } from './chat/chat.module';
import { FileManagerModule } from './file-manager/file-manager.module';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.dbType as any,
        host: configService.dbHost,
        port: configService.dbPort,
        username: configService.dbUsername,
        password: configService.dbPassword,
        database: configService.dbName,
        entities: ['./src/data/entities/*.ts'],
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        // transport: 'smtps://sintetic@abv.bg:i1li1ka5ta9!!@smtp.abv.bg',
        transport: 'smtps://gitparty@abv.bg:GitParty123@smtp.abv.bg',

        defaults: {
          from: '"GITPARTY" <gitparty@abv.bg>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(), // or new PugAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    ConfigModule,
    UsersModule,
    CoreModule,
    SharedModule,
    TeamsModule,
    ChatModule,
    FileManagerModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AuthService],
})
export class AppModule { }
