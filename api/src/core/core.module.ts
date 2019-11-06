import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Team, Members, WorkItem, ReviewRequest, ReviewVotes, Comment } from '../data/entities';
import { Notification } from '../data/entities/notification';
import { Invitation } from '../data/entities/invitation';
import { Inbox } from '../data/entities/inbox';
import { TeamService } from './services/team.service';
import { Reviewers } from '../data/entities/reviewers';
import { Message } from '../data/entities/messages';
import { Chat } from '../data/entities/chat';
import { File } from '../data/entities/files';
import { Picture } from '../data/entities/picture';

@Module({
  imports: [TypeOrmModule.forFeature(
    [Team,
      User,
      Members,
      WorkItem,
      ReviewRequest,
      ReviewVotes,
      Notification,
      Invitation,
      Inbox,
      Reviewers,
      Comment,
      Message,
      Chat,
      File,
      Picture,
    ])],
  providers: [UsersService, TeamService],
  exports: [UsersService, TeamService],
})
export class CoreModule { }
