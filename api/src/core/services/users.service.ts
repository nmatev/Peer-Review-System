import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Team, Members, WorkItem, ReviewRequest, ReviewVotes, Comment } from '../../data/entities';
import { Repository, In } from 'typeorm';
import { CreateTeamDTO, WorkItemDTO, WorkItemVoteDTO } from '../../models';
import { WorkItemStatus } from '../../common/enums/work-tem-status';
import { ReviewVoteStatus } from '../../common/enums/review-vote-status';
import { log } from 'util';
import { Notification } from '../../data/entities/notification';
import { Invitation } from '../../data/entities/invitation';
import { Inbox } from '../../data/entities/inbox';
import { Reviewers } from '../../data/entities/reviewers';
import { config } from '../../common/config';
import { NotificationType } from '../../common/enums/notification-type.enum';
import { Message } from '../../data/entities/messages';
import { File } from '../../data/entities/files';
import { MailerService } from '@nest-modules/mailer';
import { TeamService } from './team.service';

@Injectable()
export class UsersService {

    public constructor(
        @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
        @InjectRepository(Members) private readonly membersRepo: Repository<Members>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(WorkItem) private readonly workItemRepo: Repository<WorkItem>,
        @InjectRepository(ReviewRequest) private readonly reviewRequestRepo: Repository<ReviewRequest>,
        @InjectRepository(ReviewVotes) private readonly reviewVotesRepo: Repository<ReviewVotes>,
        @InjectRepository(Notification) private readonly notificationRepo: Repository<Notification>,
        @InjectRepository(Inbox) private readonly inboxRepo: Repository<Inbox>,
        @InjectRepository(Reviewers) private readonly reviewersRepo: Repository<Reviewers>,
        @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
        @InjectRepository(Message) private readonly messageRepo: Repository<Message>,
        @InjectRepository(File) private readonly fileRepo: Repository<File>,
        private readonly mailer: MailerService,
    ) { }

    async getUserDetails(userId: string) {
        const foundUser = await this.userRepo.findOne({ id: userId });

        const userTeams = await this.getUsersTeams(foundUser);
        const allTeamsInfo: any = await Promise.all(userTeams.map(
            async (team) => {
                const members = await this.getTeamMembers(team.id);
                const obj = {
                    members,
                    teamId: team.id,
                    teamName: team.name,
                };
                return obj;
            },
        ));
        const workItems = await foundUser.workItems.then(data => data.slice(-2));
        return {
            user: foundUser,
            team: allTeamsInfo,
            workItems,
        };
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

    async getAllUsers() {
        return await this.userRepo.find();
    }

    async getUserWorkItemsChartData() {
        return await this.userRepo.find({
            relations: ['workItems'],
        });
    }

    async getAllWorkItems() {
        return await this.workItemRepo.find({
            relations: ['assignee'],
        });
    }

    async getAllReviewRequests() {
        return await this.workItemRepo.find();
    }

    async getUsersTeams(user: User) {
        const foundUser = await this.userRepo.findOne({ id: user.id });

        const foundTeams: any = await this.membersRepo.find({
            relations: ['team'],
            where: {
                member: foundUser,
                isInTeam: true,
            },
        });

        return foundTeams.map(x => x.__team__);
    }

    async getUserMessages(currentUser: User, userId: string) {
        const foundUser = await this.userRepo.findOne({ id: userId });

        return await this.messageRepo.find({
            where: {
                sender: foundUser,
                receiver: currentUser,
            },
        });
    }

    async getReviewRequest(workItemId: string, crurentlyLoggedUser: User) {
        const foundWorkItem = await this.workItemRepo.findOne({
            where: {
                id: workItemId,
            },
        });

        const findReviewers = await this.reviewersRepo.find({
            where: {
                workItem: foundWorkItem,
            },
            relations: ['reviewers'],
        });

        const transformedReviewers = await Promise.all(
            findReviewers.map(async x => await x.reviewers),
        );

        const isVoted = await this.reviewVotesRepo.findOne({
            where: {
                workItem: foundWorkItem,
                author: crurentlyLoggedUser,
            },
        });

        return {
            foundWorkItem,
            reviewers: transformedReviewers,
            isVoted: Boolean(isVoted),
        };
    }

    async getWorkItemComments(workItemId: string) {
        const foundWorkItem = await this.workItemRepo.findOne({ id: workItemId });
        return await this.commentRepo.find({
            where: {
                workItem: foundWorkItem,
            },
            relations: ['author'],
        });
    }

    async getUserReviewRequests(user: User) {
        const assignee = await this.userRepo.findOne({ id: user.id });
        return await assignee.workItems;
    }

    async getTeamMembersReviewRequests(teamId: string) {
        const foundTeam: any = await this.teamRepo.findOne({
            where: {
                id: teamId,
            },
            relations: ['workItems'],
        });

        return foundTeam;
    }

    async testingTeamReviewRequests(body: any) {
        const teamIds = body.arr.split(',').map(el => el.trim());
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

    async getUserPendingReviewRequests(user: User) {
        const foundUser = await this.userRepo.findOne({ id: user.id });

        const reviewRequests = await this.reviewersRepo.find({
            relations: ['reviewers', 'workItem'],
            where: {
                reviewers: foundUser,
            },
        });

        return reviewRequests.map((x: any) => x.__workItem__).filter(x => x.status === 'Pending');
    }

    async createReviewers(usersArr: User[], workItemId: string) {
        const foundWorkItem = await this.workItemRepo.findOne({ id: workItemId });

        usersArr.map(async x => {
            const reviewingWorkItem = new Reviewers();
            reviewingWorkItem.reviewers = Promise.resolve(x);
            reviewingWorkItem.workItem = Promise.resolve(foundWorkItem);

            await this.reviewersRepo.save(reviewingWorkItem);
        });
    }

    async createNotification(message: string, receiver: User, ntfType: NotificationType) {
        const foundInbox = await this.getUserInbox(receiver);
        const notification = new Notification();
        notification.inbox = Promise.resolve(foundInbox);
        notification.isRead = false;
        notification.message = message;
        notification.type = ntfType;
        await this.notificationRepo.save(notification);
    }

    async createReviewRequest(user: User, body: WorkItemDTO) {
        const reviewAuthor = await this.userRepo.findOne({ id: user.id });
        const findReviewers = body.reviewers.map(async obj => await this.userRepo.findOne({ id: obj.id }));
        const allReviewers = await Promise.all(findReviewers);
        const sortedReviewers: any = allReviewers.filter(x => !!x);
        const userTeams = await this.teamRepo.findOne({
            where: {
                id: body.teamId,
            },
        });

        const workItem = new WorkItem();
        workItem.assignee = Promise.resolve(reviewAuthor);

        workItem.title = body.title;
        workItem.description = body.description;
        workItem.tags = body.comments;
        workItem.status = WorkItemStatus.Pending;
        workItem.teams = Promise.resolve([userTeams]);

        const savedWorkItem = await this.workItemRepo.save(workItem);
        const reviewRequest = new ReviewRequest();
        reviewRequest.author = Promise.resolve(reviewAuthor);
        reviewRequest.workItem = Promise.resolve(savedWorkItem);

        const notificationMessage = `You have been added as a reviewer to ${savedWorkItem.title}!`;
        this.createReviewers(sortedReviewers, savedWorkItem.id);
        sortedReviewers.forEach(async reviewer =>
            await this.createNotification(notificationMessage, reviewer, NotificationType.Team,
            ));

        // generating emails
        this
            .mailer
            .sendMail({
                to: 'gitparty@abv.bg', // list of receivers
                from: 'gitparty@abv.bg', // sender
                subject: 'GITPARTY - New Review Request created ✔', // Subject line
                text: 'New Review Request created.', // plaintext body
                // HTML body content
                html: '<h4>Hello,<br><br>You have been assigned as a reviewer to a new review request in your gitparty account!',
            });

        return await this.reviewRequestRepo.save(reviewRequest);
    }

    async createVote(user: User, vote: WorkItemVoteDTO, workItemId: string): Promise<any> {
        const foundWorkItem = await this.workItemRepo.findOne({
            relations: ['assignee'],
            where: {
                id: workItemId,
            },
        });
        const isAdmin = user.roles.some(x => x.name.includes('Admin'));
        const alreadyVoted = await this.reviewVotesRepo.findOne({
            relations: ['author', 'workItem'],
            where: {
                author: user,
                workItem: foundWorkItem,
            },
        });

        if (alreadyVoted) {
            throw new BadRequestException('You have already voted!');
        }

        const voteStatus = vote.state;

        const newVote = new ReviewVotes();
        newVote.author = Promise.resolve(user);
        newVote.workItem = Promise.resolve(foundWorkItem);
        newVote.state = ReviewVoteStatus[ReviewVoteStatus[+voteStatus]];

        await this.reviewVotesRepo.create(newVote);
        await this.reviewVotesRepo.save(newVote);

        const workItemVotes = await this.reviewVotesRepo.find({
            relations: ['workItem'],
            where: {
                workItem: foundWorkItem,
            },
        });

        // left to be fixed
        const voteValue: any = vote;

        if (voteValue === '2') {
            foundWorkItem.status = WorkItemStatus.Rejected;
            await this.workItemRepo.save(foundWorkItem);
            return {
                status: WorkItemStatus.Rejected,
            };
        } else {
            let voteCounter = 0;
            workItemVotes.forEach(x => {
                if (x.state === 1) {
                    voteCounter++;
                }
            });

            if ((voteCounter >= config.workItemVoteCounter) || (isAdmin)) {
                foundWorkItem.status = WorkItemStatus.Accepted;
                await this.workItemRepo.save(foundWorkItem);

                const reviewersTable = await this.reviewersRepo.find(
                    {
                        where: {
                            workItem: foundWorkItem,
                        },
                        relations: ['reviewers'],
                    },
                );
                const ntfMessage = `${foundWorkItem.title}'s status was changed to ${foundWorkItem.status};`;
                const reviewers = await reviewersTable.map((x: any) => x.__reviewers__);

                reviewers.forEach(async x => await this.createNotification(ntfMessage, x, NotificationType.WorkItem));

                return {
                    status: WorkItemStatus.Accepted,
                };
            }
        }
    }

    async createComment(user: User, body: any, workItemId: string) {
        const foundUser = await this.userRepo.findOne({ id: user.id });
        const foundWorkItem = await this.workItemRepo.findOne({ id: workItemId });

        const newComment = new Comment();
        newComment.author = Promise.resolve(foundUser);
        newComment.title = body.title; // body.title
        newComment.description = body.description; // body.description
        newComment.workItem = Promise.resolve(foundWorkItem);

        const reviewersTable = await this.reviewersRepo.find(
            {
                where: {
                    workItem: foundWorkItem,
                },
                relations: ['reviewers'],
            },
        );
        const reviewers = await reviewersTable.map((x: any) => x.__reviewers__);
        const ntfMessage = `A new comment was added to ${foundWorkItem.title}`;
        reviewers.forEach(async x => await this.createNotification(ntfMessage, x, NotificationType.WorkItem));

        return await this.commentRepo.save(newComment);
    }

    async getUserInbox(user: User) {
        const foundUser = await this.userRepo.findOne({ id: user.id });
        const userInbox = await foundUser.inbox;

        return userInbox;
    }

    async getUserInboxItems(user: User) {
        const userInbox = await this.getUserInbox(user);

        const inboxElements = {
            notifications: await userInbox.notifications,
            invitations: await userInbox.invitations,
        };

        return inboxElements;
    }

    async markNotificationsAsRead(user: User) {
        const foundInbox = await this.getUserInbox(user);
        const userNotifications = await foundInbox.notifications;

        userNotifications.map(async notification => {
            notification.isRead = true;
            await this.notificationRepo.save(notification);
        });
        return {
            message: 'Notifications have been successfully marked as read',
        };
    }
}
