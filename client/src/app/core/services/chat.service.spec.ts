import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { NotificatorService } from './notificator.service';
import { HttpClient } from '@angular/common/http';
import { ChatService } from './chat.service';
import { of } from 'rxjs';

describe('ChatService', () => {
    const http = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HttpClient,
                    useValue: http,
                },
            ]

        });
    });

    it('service should be defined', () => {
        const service: ChatService = TestBed.get(ChatService);

        expect(service).toBeTruthy();
    });

    it('service get messages count', () => {
        const service: ChatService = TestBed.get(ChatService);

        http.get.and.returnValue(of({ count: 2 }));

        service.getMessagesCount().subscribe(
            res => {
                expect(res.count).toBe(2);
            }
        );

    });

    it('service create and return message', () => {
        const service: ChatService = TestBed.get(ChatService);

        http.post.and.returnValue(of({
            receiver: 'user',
            message: 'test',
        }));

        service.createChatMessage('test', 'user').subscribe(
            res => {
                expect(res.message).toBe('test');
            }
        );
    });

    it('service create and return user', () => {
        const service: ChatService = TestBed.get(ChatService);

        http.post.and.returnValue(of({
            receiver: 'user',
            message: 'test',
        }));

        service.createChatMessage('test', 'user').subscribe(
            res => {
                expect(res.receiver).toBe('user');
            }
        );
    });
});
