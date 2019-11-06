import { UsersService } from '../core/services';
import { AuthGuard } from '@nestjs/passport';
import { UserDec } from '../common/decorators';
import { WorkItemDTO, WorkItemVoteDTO } from '../models';
import { Controller, Get, UseGuards, Post, Body, ValidationPipe, Param, Put, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileManagerService } from './file-manager.service';

@Controller('files')
export class FileManagerController {
    SERVER_URL: string = "http://localhost:3000/";

    constructor(
        private readonly fileService: FileManagerService,
    ) { }

    @Post('upload/:teamId/:workItemId')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('file',
        {
            storage: diskStorage({
                destination: './files',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        },
    ),
    )
    async uploadFile(
        @UserDec() user: any,
        @Param('teamId') teamId: string,
        @Param('workItemId') workItemId: string,
        @UploadedFile() file) {
        return await this.fileService.uploadFile(user.id, teamId, workItemId, file.filename, `${this.SERVER_URL}${file.path}`);
    }

    @Post('download')
    async downloadFile(@Body() body: any, @Res() res): Promise<any> {
        const foundFile = await this.fileService.getWorkItemFileName(body.fileName);
        res.sendFile(foundFile.fileName, { root: 'files' });
    }

    @Post('picture')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('file',
        {
            storage: diskStorage({
                destination: './avatars',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        },
    ),
    )
    async uploadProfilePicture(
        @UserDec() user: any,
        @UploadedFile() file) {
        return await this.fileService.uploadProfilePicture(user.id, file.filename, `${this.SERVER_URL}${file.path}`);
    }

    @Get('picture/:userId')
    async getProfilePicture(@Param('userId') userId, @Res() res): Promise<any> {
        const picture = await this.fileService.getProfilePicture(userId);
        res.sendFile(picture.fileName, { root: 'avatars' });
    }

    @Get('file/:workItemId')
    async getWorkItemFilie(@Param('workItemId') workItemId): Promise<any> {
        return await this.fileService.getWorkItemFile(workItemId);
        // res.sendFile('40afd86ee837e8ef55d85c600aee644b.jpg', { root: 'uploads' });
    }

}
