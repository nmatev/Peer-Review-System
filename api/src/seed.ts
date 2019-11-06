// tslint:disable-next-line: no-console
import { createConnection, Repository } from 'typeorm';
import { User, Team, Role, Members, WorkItem, Comment } from './data/entities';
import { UserRole } from './common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { WorkItemStatus } from './common/enums/work-tem-status';
import { ReviewVotes } from './data/entities/review-votes';
import { ReviewVoteStatus } from './common/enums/review-vote-status';
import { Inbox } from './data/entities/inbox';
import { Reviewers } from './data/entities/reviewers';
import { Chat } from './data/entities/chat';
import { Message } from './data/entities/messages';
import { Picture } from './data/entities/picture';
// SENSITIVE DATA ALERT! - normally the admin credentials should not be present in the public repository, but for now we will roll with it - you can think about how to do it better
// run: `npm run seed` to seed the database

const seedRoles = async connection => {
    const rolesRepo: Repository<Role> = connection.manager.getRepository(Role);

    const roles: Role[] = await rolesRepo.find();
    if (roles.length) {
        console.log('The DB already has roles!');
        return;
    }

    const rolesSeeding: Array<Promise<Role>> = Object.keys(UserRole).map(
        async (roleName: string) => {
            const role: Role = rolesRepo.create({ name: roleName });
            return await rolesRepo.save(role);
        },
    );
    await Promise.all(rolesSeeding);

    console.log('Seeded roles successfully!');
};

const seedUsers = async connection => {
    const userRepo: Repository<User> = connection.manager.getRepository(User);
    const rolesRepo: Repository<Role> = connection.manager.getRepository(Role);
    const teamRepo: Repository<Team> = connection.manager.getRepository(Team);

    const admin = await userRepo.findOne({
        where: {
            name: 'admin',
        },
    });

    if (admin) {
        console.log('The DB already has an admin!');
        return;
    }

    const adminRole: Role = await rolesRepo.findOne({ name: UserRole.Admin });
    if (!adminRole) {
        console.log('The DB does not have an admin role!');
        return;
    }

    const newAdmin: User = userRepo.create({
        name: 'admin',
        email: 'admin@abv.bg',
        password: await bcrypt.hash('admin', 10),
        roles: [adminRole],
    });

    const basicRole: Role = await rolesRepo.findOne({ name: UserRole.Basic });
    if (!basicRole) {
        console.log('The DB does not have an basic role!');
        return;
    }

    const newBasic: User = userRepo.create({
        name: 'basic',
        email: 'basic@abv.bg',
        password: await bcrypt.hash('basic', 10),
        roles: [basicRole],
    });

    const newBasic1: User = userRepo.create({
        name: 'basic1',
        email: 'basic1@abv.bg',
        password: await bcrypt.hash('basic1', 10),
        roles: [basicRole],
    });

    const newBasic2: User = userRepo.create({
        name: 'basic2',
        email: 'basic2@abv.bg',
        password: await bcrypt.hash('basic2', 10),
        roles: [basicRole],
    });

    const pesho: User = userRepo.create({
        name: 'pesho',
        email: 'pesho@abv.bg',
        password: await bcrypt.hash('pesho', 10),
        roles: [basicRole],
    });

    const ivan: User = userRepo.create({
        name: 'ivan',
        email: 'ivan@abv.bg',
        password: await bcrypt.hash('ivan', 10),
        roles: [basicRole],
    });

    const martin: User = userRepo.create({
        name: 'martin',
        email: 'martin@abv.bg',
        password: await bcrypt.hash('martin', 10),
        roles: [basicRole],
    });

    const stuco: User = userRepo.create({
        name: 'stuco',
        email: 'stuco@abv.bg',
        password: await bcrypt.hash('stuco', 10),
        roles: [basicRole],
    });

    const plamena: User = userRepo.create({
        name: 'plamena',
        email: 'plamena@abv.bg',
        password: await bcrypt.hash('plamena', 10),
        roles: [basicRole],
    });

    const nadeto: User = userRepo.create({
        name: 'nadeto',
        email: 'noreply@telerikacademy.com',
        password: await bcrypt.hash('nadeto', 10),
        roles: [basicRole],
    });

    const stivi: User = userRepo.create({
        name: 'stivi',
        email: 'stivi@telerikacademy.com',
        password: await bcrypt.hash('stivi', 10),
        roles: [basicRole],
    });

    const rosen: User = userRepo.create({
        name: 'rosen',
        email: 'rosen@telerikacademy.com',
        password: await bcrypt.hash('rosen', 10),
        roles: [basicRole],
    });

    await userRepo.save(newBasic);
    await userRepo.save(newBasic1);
    await userRepo.save(newBasic2);
    await userRepo.save(pesho);
    await userRepo.save(newAdmin);
    await userRepo.save(ivan);
    await userRepo.save(martin);
    await userRepo.save(stuco);
    await userRepo.save(plamena);
    await userRepo.save(nadeto);
    await userRepo.save(stivi);
    await userRepo.save(rosen);

    console.log('Seeded users successfully!');
};

const seedInboxes = async connection => {
    const userRepo: Repository<User> = connection.manager.getRepository(User);
    const inboxRepo: Repository<Inbox> = connection.manager.getRepository(Inbox);

    const admin = await userRepo.findOne({ name: 'admin' });
    const basic = await userRepo.findOne({ name: 'basic' });
    const basic1 = await userRepo.findOne({ name: 'basic1' });
    const basic2 = await userRepo.findOne({ name: 'basic2' });
    const pesho = await userRepo.findOne({ name: 'pesho' });
    const ivan = await userRepo.findOne({ name: 'ivan' });
    const martin = await userRepo.findOne({ name: 'martin' });
    const stuco = await userRepo.findOne({ name: 'stuco' });
    const plamena = await userRepo.findOne({ name: 'plamena' });
    const nadeto = await userRepo.findOne({ name: 'nadeto' });
    const stivi = await userRepo.findOne({ name: 'stivi' });
    const rosen = await userRepo.findOne({ name: 'rosen' });

    const adminInbox = new Inbox();
    const basicInbox = new Inbox();
    const basic1Inbox = new Inbox();
    const basic2Inbox = new Inbox();
    const peshoInbox = new Inbox();
    const ivanInbox = new Inbox();
    const martinInbox = new Inbox();
    const stucoInbox = new Inbox();
    const plamenaInbox = new Inbox();
    const nadetoInbox = new Inbox();
    const stiviInbox = new Inbox();
    const rosenInbox = new Inbox();

    adminInbox.user = Promise.resolve(admin);
    basicInbox.user = Promise.resolve(basic);
    basic1Inbox.user = Promise.resolve(basic1);
    basic2Inbox.user = Promise.resolve(basic2);
    peshoInbox.user = Promise.resolve(pesho);
    ivanInbox.user = Promise.resolve(ivan);
    martinInbox.user = Promise.resolve(martin);
    stucoInbox.user = Promise.resolve(stuco);
    plamenaInbox.user = Promise.resolve(plamena);
    nadetoInbox.user = Promise.resolve(nadeto);
    stiviInbox.user = Promise.resolve(stivi);
    rosenInbox.user = Promise.resolve(rosen);

    await inboxRepo.save(adminInbox);
    await inboxRepo.save(basicInbox);
    await inboxRepo.save(basic1Inbox);
    await inboxRepo.save(basic2Inbox);
    await inboxRepo.save(peshoInbox);
    await inboxRepo.save(ivanInbox);
    await inboxRepo.save(martinInbox);
    await inboxRepo.save(stucoInbox);
    await inboxRepo.save(plamenaInbox);
    await inboxRepo.save(nadetoInbox);
    await inboxRepo.save(stiviInbox);
    await inboxRepo.save(rosenInbox);

    console.log('Seeded inboxes successfully!');
};

const seedTeams = async connection => {
    const userRepo: Repository<User> = connection.manager.getRepository(User);
    const teamRepo: Repository<Team> = connection.manager.getRepository(Team);

    const admin = await userRepo.findOne({ name: 'admin' });
    const basic = await userRepo.findOne({ name: 'basic' });

    const team1 = new Team();
    team1.name = 'FrontEnd';
    team1.author = Promise.resolve(admin);

    const team2 = new Team();
    team2.name = 'BackEnd';
    team2.author = Promise.resolve(basic);

    await teamRepo.save(team1);
    await teamRepo.save(team2);

    console.log('Seeded teams successfully!');
};

const seedMembers = async connection => {
    const userRepo: Repository<User> = connection.manager.getRepository(User);
    const teamRepo: Repository<Team> = connection.manager.getRepository(Team);
    const membersRepo: Repository<Members> = connection.manager.getRepository(Members);

    const admin = await userRepo.findOne({ name: 'admin' });
    const basic = await userRepo.findOne({ name: 'basic' });
    const basic1 = await userRepo.findOne({ name: 'basic1' });

    const frontEndTeam = await teamRepo.findOne({ name: 'FrontEnd' });
    const backEndTeam = await teamRepo.findOne({ name: 'BackEnd' });

    const teamMembers0 = new Members();
    teamMembers0.team = Promise.resolve(frontEndTeam);
    teamMembers0.member = Promise.resolve(admin);
    teamMembers0.isInTeam = false;

    const teamMembers1 = new Members();
    teamMembers1.team = Promise.resolve(frontEndTeam);
    teamMembers1.member = Promise.resolve(basic);
    teamMembers1.isInTeam = true;

    const teamMembers2 = new Members();
    teamMembers2.team = Promise.resolve(backEndTeam);
    teamMembers2.member = Promise.resolve(admin);
    teamMembers2.isInTeam = true;

    const teamMembers3 = new Members();
    teamMembers3.team = Promise.resolve(backEndTeam);
    teamMembers3.member = Promise.resolve(basic);
    teamMembers3.isInTeam = true;

    const teamMembers4 = new Members();
    teamMembers4.team = Promise.resolve(backEndTeam);
    teamMembers4.member = Promise.resolve(basic1);
    teamMembers4.isInTeam = false;

    await membersRepo.save(teamMembers0);
    await membersRepo.save(teamMembers1);
    await membersRepo.save(teamMembers2);
    await membersRepo.save(teamMembers3);
    await membersRepo.save(teamMembers4);

    console.log('Seeded team members successfully!');
};

const seedWorkItems = async connection => {
    const userRepo: Repository<User> = connection.manager.getRepository(User);
    const workItemRepo: Repository<WorkItem> = connection.manager.getRepository(WorkItem);

    const workItem1Assignee = await userRepo.findOne({ name: 'admin' });
    const workItem2Assignee = await userRepo.findOne({ name: 'basic' });

    const workItem1 = new WorkItem();
    workItem1.assignee = Promise.resolve(workItem1Assignee);
    workItem1.title = 'testTitle';
    workItem1.description = 'this is the body of the workItem';
    workItem1.tags = 'random tags';
    workItem1.status = WorkItemStatus.Pending;

    const workItem2 = new WorkItem();
    workItem2.assignee = Promise.resolve(workItem2Assignee);
    workItem2.title = 'basic workTitle';
    workItem2.description = 'basic workbody and description';
    workItem2.tags = 'basic tags';
    workItem2.status = WorkItemStatus.Pending;

    await workItemRepo.save(workItem1);
    await workItemRepo.save(workItem2);
    console.log('Seeded workItems successfully!');
};

const seedReviewers = async connection => {
    const userRepo: Repository<User> = connection.manager.getRepository(User);
    const workItemRepo: Repository<WorkItem> = connection.manager.getRepository(WorkItem);
    const reviewersRepo: Repository<Reviewers> = connection.manager.getRepository(Reviewers);

    const reviwer1 = await userRepo.findOne({ name: 'admin' });
    const reviwer2 = await userRepo.findOne({ name: 'basic' });
    const reviwer3 = await userRepo.findOne({ name: 'pesho' });
    const workItem1 = await workItemRepo.findOne({ title: 'testTitle' });
    const workItem2 = await workItemRepo.findOne({ title: 'basic workTitle' });

    const reviewersItem = new Reviewers();
    reviewersItem.workItem = Promise.resolve(workItem1);
    reviewersItem.reviewers = Promise.resolve(reviwer1);

    const reviewersItem2 = new Reviewers();
    reviewersItem2.workItem = Promise.resolve(workItem1);
    reviewersItem2.reviewers = Promise.resolve(reviwer2);

    const reviewersItem3 = new Reviewers();
    reviewersItem3.workItem = Promise.resolve(workItem2);
    reviewersItem3.reviewers = Promise.resolve(reviwer3);

    await reviewersRepo.save(reviewersItem);
    await reviewersRepo.save(reviewersItem2);
    await reviewersRepo.save(reviewersItem3);

    console.log('Seeded reviewers successfully!');
};

const seedComments = async connection => {
    const userRepo: Repository<User> = connection.manager.getRepository(User);
    const workItemRepo: Repository<WorkItem> = connection.manager.getRepository(WorkItem);
    const commentRepo: Repository<Comment> = connection.manager.getRepository(Comment);

    const comment1Author = await userRepo.findOne({ name: 'basic2' });
    const comment2Author = await userRepo.findOne({ name: 'admin' });
    const comment1WorkItem = await workItemRepo.findOne({ title: 'the best title' });

    const comment1 = new Comment();
    comment1.author = Promise.resolve(comment1Author);
    comment1.title = 'basic comment title';
    comment1.description = 'basic comment bdy';
    comment1.workItem = Promise.resolve(comment1WorkItem);

    const comment2 = new Comment();
    comment2.author = Promise.resolve(comment2Author);
    comment2.title = 'admi title';
    comment2.description = 'admin was here';
    comment2.workItem = Promise.resolve(comment1WorkItem);

    await commentRepo.save(comment1);
    await commentRepo.save(comment2);

    console.log('Seeded comments successfully!');
};

const seedReviewVotes = async connection => {
    const userRepo: Repository<User> = connection.manager.getRepository(User);
    const workItemRepo: Repository<WorkItem> = connection.manager.getRepository(WorkItem);
    const reviewVotesRepo: Repository<ReviewVotes> = connection.manager.getRepository(ReviewVotes);

    const admin = await userRepo.findOne({ name: 'admin' });
    const basic = await userRepo.findOne({ name: 'basic' });
    const workItem = await workItemRepo.findOne({ title: 'testTitle' });

    const reviewVote = new ReviewVotes();
    reviewVote.state = ReviewVoteStatus.PENDING;
    reviewVote.author = Promise.resolve(admin);
    reviewVote.workItem = Promise.resolve(workItem);

    const reviewVote2 = new ReviewVotes();
    reviewVote2.state = ReviewVoteStatus.PENDING;
    reviewVote2.author = Promise.resolve(basic);
    reviewVote2.workItem = Promise.resolve(workItem);

    await reviewVotesRepo.save(reviewVote);
    await reviewVotesRepo.save(reviewVote2);

    console.log('Seeded reviewVotes successfully!');
};

const seedMessages = async connection => {
    const userRepo: Repository<User> = connection.manager.getRepository(User);
    const workItemRepo: Repository<WorkItem> = connection.manager.getRepository(WorkItem);
    const reviewVotesRepo: Repository<ReviewVotes> = connection.manager.getRepository(ReviewVotes);
    const messageRepo: Repository<Message> = connection.manager.getRepository(Message);
    const chatRepo: Repository<Chat> = connection.manager.getRepository(Chat);

    const admin = await userRepo.findOne({ name: 'admin' });
    const pesho = await userRepo.findOne({ name: 'pesho' });
    const basic = await userRepo.findOne({ name: 'basic' });

    const newMessage = new Message();
    newMessage.message = 'Pesho: Hi admin';
    newMessage.sender = Promise.resolve(pesho);
    newMessage.receiver = Promise.resolve(admin);

    const newMessage2 = new Message();
    newMessage2.message = 'Admin: Hi there mate';
    newMessage2.sender = Promise.resolve(admin);
    newMessage2.receiver = Promise.resolve(pesho);

    const newMessage3 = new Message();
    newMessage3.message = 'Admin: how are you doing pesho?';
    newMessage3.sender = Promise.resolve(admin);
    newMessage3.receiver = Promise.resolve(pesho);

    const AdminPeshoChat = new Chat();
    AdminPeshoChat.messages = Promise.resolve([newMessage, newMessage2, newMessage3]);

    // PESHO AND BASIC CHAT

    const PeshoBasicMsgs = new Message();
    PeshoBasicMsgs.message = 'Basic: Hi pesho';
    PeshoBasicMsgs.sender = Promise.resolve(basic);
    PeshoBasicMsgs.receiver = Promise.resolve(pesho);

    const PeshoBasicMsgs2 = new Message();
    PeshoBasicMsgs2.message = 'Basic: Why u no answering';
    PeshoBasicMsgs2.sender = Promise.resolve(basic);
    PeshoBasicMsgs2.receiver = Promise.resolve(pesho);

    const PeshoBasicChat = new Chat();
    PeshoBasicChat.messages = Promise.resolve([PeshoBasicMsgs, PeshoBasicMsgs2]);

    await messageRepo.save(newMessage);
    await messageRepo.save(newMessage2);
    await messageRepo.save(newMessage3);

    await messageRepo.save(PeshoBasicMsgs);
    await messageRepo.save(PeshoBasicMsgs2);

    await chatRepo.save(AdminPeshoChat);
    await chatRepo.save(PeshoBasicChat);

    console.log('Seeded messages successfully!');
};

const seedPictures = async connection => {
    const userRepo: Repository<User> = connection.manager.getRepository(User);
    const workItemRepo: Repository<WorkItem> = connection.manager.getRepository(WorkItem);
    const reviewVotesRepo: Repository<ReviewVotes> = connection.manager.getRepository(ReviewVotes);
    const messageRepo: Repository<Message> = connection.manager.getRepository(Message);
    const chatRepo: Repository<Chat> = connection.manager.getRepository(Chat);
    const pictureRepo: Repository<Picture> = connection.manager.getRepository(Picture);

    const admin = await userRepo.findOne({ name: 'admin' });
    const pesho = await userRepo.findOne({ name: 'pesho' });
    const basic = await userRepo.findOne({ name: 'basic' });

    const userPicture = new Picture();
    userPicture.filePath = `http://localhost:3000/avatars/default-picture.png`;
    userPicture.fileName = `default-picture.png`;
    userPicture.userId = `default-picture-id`;

    const teamPicture = new Picture();
    teamPicture.filePath = `http://localhost:3000/avatars/team-default-picture.jpg`;
    teamPicture.fileName = `team-default-picture.jpg`;
    teamPicture.userId = `team-default-picture-id`;

    await pictureRepo.save(userPicture);
    await pictureRepo.save(teamPicture);

    console.log('Seeded pictures successfully!');
};

const seed = async () => {
    console.log('Seed started!');
    const connection = await createConnection();

    await seedRoles(connection);
    await seedUsers(connection);
    await seedTeams(connection);
    await seedMembers(connection);
    await seedWorkItems(connection);
    await seedComments(connection);
    await seedReviewVotes(connection);
    await seedInboxes(connection);
    await seedReviewers(connection);
    await seedMessages(connection);
    await seedPictures(connection);

    await connection.close();
    console.log('Seed completed!');
};

seed().catch(console.error);
