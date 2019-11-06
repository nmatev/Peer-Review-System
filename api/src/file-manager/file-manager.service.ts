import { Injectable } from '@nestjs/common';
import { File } from '../data/entities/files';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Picture } from '../data/entities/picture';

@Injectable()
export class FileManagerService {

    constructor(
        @InjectRepository(File) private readonly fileRepo: Repository<File>,
        @InjectRepository(Picture) private readonly pictureRepo: Repository<Picture>,

    ) { }

    async uploadProfilePicture(userId: string, fileName: string, filePath: string) {
        const foundPicture = await this.pictureRepo.findOne({ userId });

        if (!foundPicture) {
            const newPicture = new Picture();
            newPicture.userId = userId;
            newPicture.filePath = filePath;
            newPicture.fileName = fileName;

            return await this.pictureRepo.save(newPicture);
        }

        foundPicture.userId = userId;
        foundPicture.filePath = filePath;
        foundPicture.fileName = fileName;

        return await this.pictureRepo.save(foundPicture);
    }

    async uploadFile(userId: string, teamId: string, workItemId: string, fileName: string, filePath: string) {
        const newFile = new File();
        newFile.userId = userId;
        newFile.workItemId = workItemId;
        newFile.teamId = teamId;
        newFile.filePath = filePath;
        newFile.fileName = fileName;
        return await this.fileRepo.save(newFile);
    }

    async getProfilePicture(userId: string) {
        const foundPicture = await this.pictureRepo.findOne({ userId });

        if (!foundPicture) {
            return await this.pictureRepo.findOne({ userId: 'default-picture-id' });
        }

        return foundPicture;
    }

    async getWorkItemFile(workItemId: string) {
        return await this.fileRepo.findOne({ workItemId });
    }

    async getWorkItemFileName(fileName: string) {
        return await this.fileRepo.findOne({ fileName });
    }
}
