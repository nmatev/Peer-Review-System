import { Controller, UseGuards, Get, Param, Post, Body, ValidationPipe, Put, Delete } from '@nestjs/common';
import { TeamService } from '../core/services';
import { AuthGuard } from '@nestjs/passport';
import { FindTeamGuard, InvitationGuard, FindUserGuard, AdminAuthorGuard } from '../common/guards';
import { UserDec } from '../common/decorators';
import { CreateTeamDTO } from '../models';
import { Team, User, Invitation, Members } from '../data/entities';

@Controller('teams')
export class TeamsController {

    constructor(
        private readonly teamService: TeamService,
    ) { }

    @Get()
    async getAllTeams(): Promise<Team[]> {
        return await this.teamService.getAllTeams();
    }

    @Get('charts/workitems')
    async getTeamWorkItemsChartData(
    ): Promise<any> {
        return await this.teamService.getAllTeamWorkItems();
    }

    @Get('charts/team-members')
    async getAllTeamsMembers(
    ): Promise<any> {
        return await this.teamService.getAllTeamsMembers();
    }

    @Get('workItems')
    @UseGuards(AuthGuard())
    async getAllTeamWorkItems(
    ): Promise<any> {
        return await this.teamService.getAllTeamWorkItems();
    }

    @Post('reviews')
    @UseGuards(AuthGuard())
    async getTeamMembersReviewRequests(
        @Body() body: any,
    ) {
        return await this.teamService.testingTeamReviewRequests(body);
    }

    @Delete(':teamId')
    @UseGuards(AuthGuard())
    async leaveTeam(
        @UserDec() user: any,
        @Param('teamId') teamId: string,
    ) {
        return await this.teamService.leaveTeam(user, teamId);
    }

    @Get(':teamId')
    @UseGuards(AuthGuard())
    async getTeamDetails(
        @Param('teamId') teamId: string,
    ): Promise<Team> {
        return await this.teamService.getTeamDetails(teamId);
    }

    @Get('members/:teamId')
    @UseGuards(AuthGuard(), FindTeamGuard)
    async getTeamMembers(
        @Param('teamId') teamId: string,
    ): Promise<User[]> {
        return await this.teamService.getTeamMembers(teamId);
    }

    @Post()
    @UseGuards(AuthGuard())
    async createTeam(
        @UserDec() user: any,
        @Body(new ValidationPipe({ transform: true, whitelist: true })) team: CreateTeamDTO): Promise<Team> {
        return await this.teamService.createTeam(user, team);
    }

    @Post('accept/invitation')
    @UseGuards(AuthGuard())
    async handleInvitation(
        @UserDec() user: any,
        @Body() body: any,
    ): Promise<object> {
        return await this.teamService.handleInvitation(user, body);
    }

    @Put(':teamId/:userId')
    @UseGuards(AuthGuard(), FindTeamGuard, FindUserGuard, AdminAuthorGuard)
    async addTeamMember(
        @UserDec() user: any,
        @Param('teamId') teamId: string,
        @Param('userId') userId: string,
    ): Promise<any> {
        return await this.teamService.addTeamMember(user, teamId, userId);
    }

    @Post('invite/:teamId')
    @UseGuards(AuthGuard())
    async inviteMemberToTeam(
        @UserDec() user: any,
        @Param('teamId') teamId: string,
        @Body() body: any,
    ): Promise<Invitation> {
        return await this.teamService.inviteMemberToTeam(user, teamId, body);
    }

    @Get('invitations/:invitationId')
    @UseGuards(AuthGuard())
    async getInvitationDetails(
        @UserDec() user: any,
        @Param('invitationId') invitationId: string,
    ) {
        return await this.teamService.getInvitationDetails(invitationId);
    }

    @Post('remove-members/:teamId')
    @UseGuards(AuthGuard())
    async removeMembersFromTeam(
        @UserDec() user: any,
        @Param('teamId') teamId: string,
        @Body() body: any,
    ) {
        return await this.teamService.removeMembersFromTeam(user, teamId, body);
    }
}
