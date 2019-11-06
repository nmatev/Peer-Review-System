import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Team, Members, WorkItem, ReviewRequest, ReviewVotes } from '../../data/entities';
import { Repository, In } from 'typeorm';
import { CreateTeamDTO, WorkItemDTO, WorkItemVoteDTO } from '../../models';
import { WorkItemStatus } from '../../common/enums/work-tem-status';
import { ReviewVoteStatus } from '../../common/enums/review-vote-status';
import { log } from 'util';
import { Notification } from '../../data/entities/notification';
import { Invitation } from '../../data/entities/invitation';
import { Inbox } from '../../data/entities/inbox';
import { NotificationType } from '../../common/enums/notification-type.enum';
import { UsersService } from './users.service';

@Injectable()
export class TeamService {

    public constructor(
        @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
        @InjectRepository(Members) private readonly membersRepo: Repository<Members>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Notification) private readonly notificationRepo: Repository<Notification>,
        @InjectRepository(Invitation) private readonly invitationRepo: Repository<Invitation>,
        @InjectRepository(Inbox) private readonly inboxRepo: Repository<Inbox>,
        private readonly userService: UsersService,
    ) { }

    async testingTeamReviewRequests(body: any) {
        const teamIds = body.teamIds.split(',').map(el => el.trim());
        const teams: any = await this.teamRepo.find({
            where: {
                id: In(teamIds),
            },
            relations: ['workItems'],
        });

        const arrWorkItems = [];

        teams.forEach(team => team.__workItems__.map(x => arrWorkItems.push(
            {
                teamName: team.name,
                ...x,
            },
        )));

        return arrWorkItems;
    }

    async createTeam(user: User, team: CreateTeamDTO): Promise<Team> {
        const teamAuthor = await this.userRepo.findOne({ id: user.id });
        const newTeam = new Team();

        newTeam.author = Promise.resolve(teamAuthor);
        newTeam.name = team.name;
        newTeam.members = Promise.resolve([teamAuthor]);
        const savedTeam = await this.teamRepo.save(newTeam);

        const newTeamMembers = new Members();
        newTeamMembers.member = Promise.resolve(teamAuthor);
        newTeamMembers.team = Promise.resolve(savedTeam);
        newTeamMembers.isInTeam = true;

        await this.membersRepo.save(newTeamMembers);
        return savedTeam;
    }

    async inviteMemberToTeam(currentUser: User, teamId: string, body: any): Promise<Invitation> {

        const members = body.members;

        const foundTeam = await this.teamRepo.findOne({ id: teamId });

        const teamMembers: any = await this.getTeamMembers(teamId);

        const foundInboxes = await Promise.all(members.map(async user => await this.userService.getUserInbox(user)));

        // checks if the user is part of the team and would be able to invite other people
        const canUserInvite = teamMembers.some(x => x.id.includes(currentUser.id));
        const isAdmin = currentUser.roles[0].name.includes('Admin');
        const inviteGuard = isAdmin || canUserInvite;

        if (!inviteGuard) {
            throw new BadRequestException(`You can invite people only in the team you are a part!`);
        }

        members.map(async (_, idx) => {
            const foundUser = members[idx];
            const foundInbox: any = foundInboxes[idx];

            const notification = new Notification();
            notification.inbox = Promise.resolve(foundInbox);
            notification.isRead = false;
            notification.message = `You have been invited to join ${foundTeam.name} team!`;
            notification.type = NotificationType.Invitation;

            const savedNtf = await this.notificationRepo.save(notification);

            const invitation = new Invitation();
            invitation.team = Promise.resolve(foundTeam);
            invitation.user = Promise.resolve(foundUser);
            invitation.status = false; // not accepted by defaul
            invitation.inbox = Promise.resolve(foundInbox);
            invitation.notificationId = savedNtf.id;
            await this.invitationRepo.save(invitation);
        });

        return;
    }

    async handleInvitation(user: User, body: any): Promise<object> {
        const foundInvitation = await this.invitationRepo.findOne({ notificationId: body.notificationId });
        const foundUser = await this.userRepo.findOne({ id: user.id });
        const invState = body.state;
        const notificationId = body.notificationId;

        const team = await foundInvitation.team;

        if (invState === 'decline') {
            const foundNotification = await this.notificationRepo.findOne({ id: notificationId });
            if (foundNotification.isRead === true) {
                throw new BadRequestException(`You have already accepted or declined the invitation!`);
            }
            foundNotification.isRead = true;
            await this.notificationRepo.save(foundNotification);

            return {
                message: `You have succesfully declined the invitation!`,
            };
        }

        foundInvitation.status = true; // user accepts the invitation here

        await this.invitationRepo.save(foundInvitation);
        await this.addTeamMember(foundUser, team.id, foundUser.id);

        return {
            message: `You have successfully accepted the invitation!`,
        };
    }

    async addTeamMember(user: User, teamId: string, userId: string): Promise<any> {
        const foundTeam = await this.teamRepo.findOne({ id: teamId });
        const foundUser = await this.userRepo.findOne({ id: userId });
        const ntfMessage = `You have been assigned to ${foundTeam.name} team!`;

        const userExistsInMembersTable = await this.membersRepo.findOne({
            relations: ['member', 'team'],
            where: { member: foundUser, team: foundTeam },
        });

        if (!userExistsInMembersTable) {
            const teamMemberToAdd = new Members();
            teamMemberToAdd.isInTeam = true;
            teamMemberToAdd.member = Promise.resolve(foundUser);
            teamMemberToAdd.team = Promise.resolve(foundTeam);

            await this.userService.createNotification(ntfMessage, foundUser, NotificationType.Team);
            return await this.membersRepo.save(teamMemberToAdd);
        }

        if (userExistsInMembersTable.isInTeam === false) {
            userExistsInMembersTable.isInTeam = !userExistsInMembersTable.isInTeam;

            await this.userService.createNotification(ntfMessage, foundUser, NotificationType.Invitation);
            return await this.membersRepo.save(userExistsInMembersTable);

        }

        throw new BadRequestException(`You are already a part of ${foundTeam.name} team!`);
    }

    async leaveTeam(user: User, teamId: string) {
        const foundUser = await this.userRepo.findOne({ id: user.id });
        const foundTeam = await this.teamRepo.findOne({ id: teamId });

        const userExistsInMembersTable = await this.membersRepo.findOne({
            relations: ['member'],
            where: { member: foundUser, team: foundTeam },
        });

        if (!userExistsInMembersTable) {
            throw new BadRequestException(`User with name ${foundUser.name} is not a part of your team!`);
        }

        if (userExistsInMembersTable.isInTeam) {
            userExistsInMembersTable.isInTeam = false;
            return await this.membersRepo.save(userExistsInMembersTable);
        }
    }

    async removeMembersFromTeam(currentUser: User, teamId: string, body: any) {
        const members = body.members;

        const foundTeam = await this.teamRepo.findOne({ id: teamId });

        const teamMembers: any = await this.getTeamMembers(teamId);

        const foundInboxes: any = await Promise.all(members.map(async user => await this.userService.getUserInbox(user)));

        const updatedMembers = members.map(async (x, idx) => {
            const found = await this.membersRepo.findOne({
                where: {
                    member: x,
                    team: foundTeam,
                },
                relations: ['member', 'team'],
            });

            found.isInTeam = false;

            const ntfMessage = `You have been removed from ${foundTeam.name} team!`;
            this.userService.createNotification(ntfMessage, x, NotificationType.Team);

            await this.membersRepo.save(found);
        });

        return;
    }

    async getAllTeams(): Promise<Team[]> {
        return await this.teamRepo.find({
            relations: ['author'],
        });
    }

    async getAllTeamWorkItems() {
        const foundTeamWorkItems = await this.teamRepo.find({
            relations: ['workItems'],
        });

        return foundTeamWorkItems;
    }

    async getAllTeamsMembers() {
        return await this.teamRepo.find({
            relations: ['members'],
        });
    }

    async getTeamMembers(teamId: string): Promise<User[]> {
        const foundTeam = await this.teamRepo.findOne({ id: teamId });

        const foundTeamMembers = await this.membersRepo.find({
            relations: ['member'],
            where: {
                team: foundTeam,
            },
        });

        const filteredMembers: any = foundTeamMembers.filter(x => x.isInTeam === true);

        return filteredMembers.map(x => x.__member__);
    }

    async getTeamDetails(teamId: string): Promise<any> {
        const team = await this.teamRepo.findOne({ id: teamId });
        const teamMembers = await this.getTeamMembers(teamId);

        return {
            team,
            teamMembers,
        };
    }

    async getInvitationDetails(invitationId: string) {
        const foundNotification = await this.notificationRepo.findOne({
            where: { id: invitationId },
        });

        const notificationInbox = await foundNotification.inbox;
        const foundUserInbox = await this.inboxRepo.findOne({ id: notificationInbox.id });

        return await this.invitationRepo.findOne({
            where: {
                inbox: foundUserInbox,
            },
            relations: ['inbox', 'team', 'user'],
        });
    }
}
