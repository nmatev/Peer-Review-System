
import "reflect-metadata";
import { createConnection, Repository } from "typeorm";
import { Members, Team, User, WorkItem } from "./data/entities";
import { Inbox } from "./data/entities/inbox";
import { connect } from "net";
import { Reviewers } from "./data/entities/reviewers";
import { Notification } from "./data/entities/notification";
import { Chat } from "./data/entities/chat";
import { Message } from "./data/entities/messages";
import { File } from "./data/entities/files";
const main = async () => {
    const connection = await createConnection();

    const membersRepo: Repository<Members> = connection.manager.getRepository(Members);
    const teamRepo: Repository<Team> = connection.manager.getRepository(Team);
    const inboxRepo: Repository<Inbox> = connection.manager.getRepository(Inbox);
    const userRepo: Repository<User> = connection.manager.getRepository(User);
    const reviewersRepo: Repository<Reviewers> = connection.manager.getRepository(Reviewers);
    const notificationRepo: Repository<Notification> = connection.manager.getRepository(Notification);
    const workItemRepo: Repository<WorkItem> = connection.manager.getRepository(WorkItem);
    const chatRepo: Repository<Chat> = connection.manager.getRepository(Chat);
    const messagesRepo: Repository<Message> = connection.manager.getRepository(Message);
    const fileRepo: Repository<File> = connection.manager.getRepository(File);

    const foundUser = await userRepo.findOne({ name: 'admin' });

    const foundUserTeams: any = await membersRepo.find({
        relations: ['team'],
        where: {
            member: foundUser,
            isInTeam: true,
        },
    });

    const transformedUserTeams = foundUserTeams.map(x => x.__team__);
    const teamMembers = await Promise.all(transformedUserTeams.map(async team => await team.members));

};

main().catch(console.error);
