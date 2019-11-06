import { Expose } from 'class-transformer';
import 'class-validator';

export class ReturnUserDTO {
    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    dateCreated: Date;

    @Expose()
    id: string;
}
