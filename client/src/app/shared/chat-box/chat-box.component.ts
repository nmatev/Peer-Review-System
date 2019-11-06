import { Component, OnInit, OnDestroy, HostListener, ElementRef, Input } from '@angular/core';

import { LiveDataListener } from 'src/app/common/models';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth';
import { StorageService, UserService, ChatService } from '../../core';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit, LiveDataListener, OnDestroy {
  public chatState = false;
  public chatAreaState = false;
  public messagers: any;
  public messages: any = [];
  public dbMessagesCount: number;
  public messagersSubscription: Subscription;
  public messagesSubscription: Subscription;
  public lastMsgSubscription: Subscription;
  public currentChatter: any;
  public currentUserName: string;
  public isThereChange: boolean;
  public showMsgCounter = 0;
  public lastMsgSender: any;
  public lastMsgerState = false;
  private msgAudio: any;
  public currentUserId: string;

  constructor(
    private readonly chatService: ChatService,
    private readonly storage: StorageService,
    private readonly userService: UserService,
    private readonly auth: AuthService,
    private readonly eRef: ElementRef,
  ) {
    const isLoggedIn = this.auth.isUserAuthenticated();
    if (isLoggedIn) {
      this.liveDataListener(3000);
    }
  }

  ngOnInit() {
    this.currentUserId = this.storage.get('userId');
    this.currentUserName = this.storage.get('username');
    this.messagersSubscription = this.userService.getAllUsers().subscribe(
      (data: any) => {
        const currentLoggedUserId = this.storage.get('userId');
        this.messagers = data.filter(x => x.id !== currentLoggedUserId);
      });
    this.chatService.getMessagesCount().subscribe(data => this.dbMessagesCount = data);
    this.lastMsgSubscription = this.chatService.getLastUserMessage().subscribe((user: any) => {
      this.lastMsgSender = user;
      this.lastMsgerState = true;
    });
  }

  ngOnDestroy() {

  }

  @HostListener('document:click', ['$event'])
  toggleChat(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
      this.chatState = true;
      this.showMsgCounter = 0;
    } else {
      this.chatState = false;
    }
  }

  openChat(selectedChatter: any) {
    // this.messages = []; // resets the previous chat messages;
    this.currentChatter = selectedChatter; // takes the currently selected user to chat with
    this.chatService.getUserChatMessages(this.currentChatter.id).subscribe(data => {
      this.messages = data;
      console.log(data);
    });
    this.chatAreaState = true;
  }

  createChatMessage(message: string) {
    this.chatService.createChatMessage(message, this.currentChatter).subscribe();
  }

  liveDataListener(time: number): void {
    setInterval(() => {
      this.messagesSubscription = this.chatService
        .getMessagesCount()
        .subscribe(
          count => {

            this.isThereChange = count === this.dbMessagesCount;
            if (!this.isThereChange) {
              this.showMsgCounter++;
              this.msgAudio = new Audio();
              this.msgAudio.src = '../../../assets/sounds/msgsound.mp4';
              this.msgAudio.load();
              this.msgAudio.play();
              this.lastMsgSubscription = this.chatService.getLastUserMessage().subscribe((user: any) => {
                this.lastMsgSender = user;
                this.lastMsgerState = true;
              });
              this.ngOnInit();
            }

            // unsubscribing after the data-check has finished
            this.lastMsgSubscription.unsubscribe();
            this.messagesSubscription.unsubscribe();
          }
        );
    }, time);
  }

  toggleLastMsgerState() {
    this.lastMsgerState = !this.lastMsgerState;
  }
}
