import { Controller, Get, Res, UseGuards, Param, Post, Body, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDec } from '../common/decorators';
import { ChatService } from './chat.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('chat')
export class ChatController {
    SERVER_URL: string = "http://localhost:3000/";
    constructor(private readonly chatService: ChatService) { }

    @Post('file')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('file',
        {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        },
    ),
    )
    uploadAvatar(
        @UserDec() user: any,
        @UploadedFile() file) {
        this.chatService.setFile(user.id, `${this.SERVER_URL}${file.path}`);
    }

    @Get('file/:fileId')
    async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
        res.sendFile(fileId, { root: 'uploads' });
    }

    @Get('download/file/:fileId')
    async downloadFile(@Param('fileId') fileId, @Res() res): Promise<any> {
        const file = `./uploads/${fileId}`;
        res.download(file); // Set disposition and send it.
    }

    @Get('messages')
    @UseGuards(AuthGuard())
    async getMessagesCount(
        @UserDec() user: any,
    ) {
        return await this.chatService.getMessagesCount(user);
    }

    @Get('messages/last')
    @UseGuards(AuthGuard())
    async getLastUserMessage(
        @UserDec() user: any,
    ) {
        return await this.chatService.getLastUserMessage(user);
    }

    @Get(':userId')
    @UseGuards(AuthGuard())
    async getAllChatMessages(
        @UserDec() user: any,
        @Param('userId') userId: string,
    ) {
        return await this.chatService.getAllChatMessages(user, userId);
    }

    @Post('messages')
    @UseGuards(AuthGuard())
    async createMessage(
        @UserDec() user: any,
        @Body() body: any,
    ) {
        return await this.chatService.createMessage(user, body);
    }

}
