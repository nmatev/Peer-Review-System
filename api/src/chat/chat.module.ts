import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';

@Module({
  providers: [ChatService],
  controllers: [ChatController],
  imports: [SharedModule, CoreModule],
})
export class ChatModule { }
