import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule, SharedModule],
  controllers: [TeamsController],
})
export class TeamsModule { }
