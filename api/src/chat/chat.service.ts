import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../data/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../data/entities/chat';
import { Message } from '../data/entities/messages';
import { CreateMessageDTO } from '../models/chats/create-message.dto';
import { File } from '../data/entities/files';

@Injectable()
export class ChatService {

    constructor(
        @InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Message) private readonly messagesRepo: Repository<Message>,
        @InjectRepository(File) private readonly fileRepo: Repository<File>,
    ) { }

    public async setFile(userId: string, fileUrl: string) {
        const newFile = new File();
        newFile.filePath = fileUrl;
        newFile.userId = userId;
        await this.fileRepo.save(newFile);
    }

    async getMessagesCount(currentUser: User) {
        const length = await this.messagesRepo
            .find({
                where: [
                    { receiver: currentUser },
                ],
            }).then(data => data.length);
        return length;
    }

    async getLastUserMessage(currentUser: User) {
        const lastMsg = await this.messagesRepo.find({
            where: { receiver: currentUser },
            order: { createdOn: 'ASC' },
        });
        if (lastMsg.length === 0) {
            return 0;
        }
        return await lastMsg[lastMsg.length - 1].sender;
    }

    async getAllChatMessages(user: User, userId: string) {
        const currentLoggedUser = await this.userRepo.findOne({ id: user.id });
        const foundChatter = await this.userRepo.findOne({ id: userId });

        // checks if there are any messages between the current users, no matter who's receiver or sender
        const foundMessages = await this.messagesRepo.findOne({
            where: [
                { sender: currentLoggedUser, receiver: foundChatter },
                { sender: foundChatter, receiver: currentLoggedUser },
            ],
        });

        if (!foundMessages) {
            return [];
        }

        // takes the chat by the messages and returns all messages for that chatId in ASC order
        const foundChat = await foundMessages.chat;
        return await this.messagesRepo.find({
            where: { chat: foundChat },
            relations: ['sender', 'receiver'],
            order: {
                createdOn: 'ASC',
            },
            take: 15,
        });
        // (msgs);
        // // const chattest = await this.chatRepo.findOne({ id: foundChat.id });
        // // (chattest);
    }

    async createMessage(user: User, body: CreateMessageDTO) {
        const receiver: any = body.receiver;
        const msgCreator = await this.userRepo.findOne({ id: user.id });
        const msgReceiver = await this.userRepo.findOne({ id: receiver.id });

        const foundMessages = await this.messagesRepo.findOne({
            where: [
                { sender: msgCreator, receiver: msgReceiver },
                { sender: msgReceiver, receiver: msgCreator },
            ],
        });

        if (!foundMessages) {
            // creating new chat between users if there has not been found one
            const createdChat = new Chat();
            const newChat = await this.chatRepo.save(createdChat);
            return await this.saveMessage(newChat, msgReceiver, msgCreator, body.message);
        }

        const foundExistingChat = await foundMessages.chat;
        return await this.saveMessage(foundExistingChat, msgReceiver, msgCreator, body.message);
    }

    async saveMessage(chat: Chat, receiver: User, sender: User, message: string) {
        const currentLoggedUser = await this.userRepo.findOne({ id: sender.id });
        const foundChatter = await this.userRepo.findOne({ id: receiver.id });
        const foundChat = await this.chatRepo.findOne({ id: chat.id });

        const newMsg = new Message();
        newMsg.sender = Promise.resolve(currentLoggedUser);
        newMsg.receiver = Promise.resolve(foundChatter);
        newMsg.message = message;
        const savedMsg = await this.messagesRepo.save(newMsg);

        const chatMessages = await this.messagesRepo.find({ where: { chat: foundChat } });
        chatMessages.push(newMsg);

        foundChat.messages = Promise.resolve(chatMessages);
        await this.chatRepo.save(foundChat);
        return savedMsg;
    }
}
