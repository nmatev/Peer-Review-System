import { UsersService } from '../core/services';
import { AuthGuard } from '@nestjs/passport';
import { UserDec } from '../common/decorators';
import { WorkItemDTO, WorkItemVoteDTO } from '../models';
import { Controller, Get, UseGuards, Post, Body, ValidationPipe, Param, Put, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { async } from 'rxjs/internal/scheduler/async';

@Controller('users')
export class UsersController {
    SERVER_URL: string = "http://localhost:3000/";

    public constructor(
        private readonly usersService: UsersService,
    ) { }
  
    @Get()
    async getAllUsers() {
        return await this.usersService.getAllUsers();
    }

    @Get('info/:userId')
    @UseGuards(AuthGuard())
    async getUserDetails(
        @Param('userId') userId: string,
    ) {
        return await this.usersService.getUserDetails(userId);
    }

    @Get('user/workitems')
    async getUserWorkItemsChartData(
    ): Promise<any> {
        return await this.usersService.getUserWorkItemsChartData();
    }

    @Get('all-reviewrequests')
    async getReviewRequests() {
        return await this.usersService.getAllReviewRequests();
    }

    @Put('notifications')
    @UseGuards(AuthGuard())
    async markNotificationsAsRead(
        @UserDec() user: any,
    ) {
        return await this.usersService.markNotificationsAsRead(user);
    }

    @Get('inbox')
    @UseGuards(AuthGuard())
    async getUserInboxItems(
        @UserDec() user: any,
    ) {
        return await this.usersService.getUserInboxItems(user);
    }

    @Get('reviews')
    @UseGuards(AuthGuard())
    async getUserReviewRequests(
        @UserDec() user: any,
    ) {
        return await this.usersService.getUserReviewRequests(user);
    }

    @Get('messages/:userId')
    @UseGuards(AuthGuard())
    async getUserMessages(
        @UserDec() user: any,
        @Param('userId') userId: string,
    ) {
        return await this.usersService.getUserMessages(user, userId);
    }

    @Get('reviews/:workItemId')
    @UseGuards(AuthGuard())
    async getReviewRequest(
        @UserDec() user: any,
        @Param('workItemId') workItemId: any,
    ) {
        return await this.usersService.getReviewRequest(workItemId, user);
    }

    @Get('pending-reviews')
    @UseGuards(AuthGuard())
    async getUserPendingReviewRequests(
        @UserDec() user: any,
    ) {
        return await this.usersService.getUserPendingReviewRequests(user);
    }

    @Post('reviews')
    @UseGuards(AuthGuard())
    async createReviewRequest(
        @UserDec() user: any,
        @Body(new ValidationPipe({ transform: true, whitelist: true })) body: WorkItemDTO,
    ) {
        return await this.usersService.createReviewRequest(user, body);
    }

    @Put('workItems/:workItemId/:voteValue')
    @UseGuards(AuthGuard())
    async assignVote(
        @UserDec() user: any,
        @Param('voteValue') voteValue: WorkItemVoteDTO,
        @Param('workItemId') workItemId: string,
    ) {
        return await this.usersService.createVote(user, voteValue, workItemId);
    }

    @Post(':workItemId')
    @UseGuards(AuthGuard())
    async createVote(
        @UserDec() user: any,
        @Body() body: any,
        @Param('workItemId') workItemId: string,
    ) {
        return await this.usersService.createComment(user, body, workItemId);
    }

    @Get(':workItemId/comments')
    @UseGuards(AuthGuard())
    async getWorkItemComments(
        @Param('workItemId') workItemId: string,
    ) {
        return await this.usersService.getWorkItemComments(workItemId);
    }

    @Get('workItems')
    @UseGuards(AuthGuard())
    async getAllWorkItems(
    ) {
        return await this.usersService.getAllWorkItems();
    }

    @Get('teams')
    @UseGuards(AuthGuard())
    async getUserTeams(
        @UserDec() user: any,
    ) {
        return await this.usersService.getUsersTeams(user);
    }
}
