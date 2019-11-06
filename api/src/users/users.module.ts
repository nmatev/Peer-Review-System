import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [CoreModule, SharedModule],
  controllers: [UsersController],
})
export class UsersModule { }
