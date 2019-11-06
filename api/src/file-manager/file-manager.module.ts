import { Module } from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { FileManagerController } from './file-manager.controller';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  providers: [FileManagerService],
  controllers: [FileManagerController],
  imports: [CoreModule, SharedModule],
})
export class FileManagerModule { }
