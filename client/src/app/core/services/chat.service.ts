import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ChatService {

    constructor(
        private readonly http: HttpClient,
    ) { }

    getLastUserMessage() {
        return this.http.get(`http://localhost:3000/chat/messages/last`);
    }

    getUserChatMessages(userId: string): Observable<any> {
        return this.http.get(`http://localhost:3000/chat/${userId}`);
    }

    getMessagesCount(): Observable<any> {
        return this.http.get(`http://localhost:3000/chat/messages`);
    }

    createChatMessage(message: string, receiver: any): Observable<any> {
        return this.http.post('http://localhost:3000/chat/messages', {
            receiver,
            message,
        });
    }
}
