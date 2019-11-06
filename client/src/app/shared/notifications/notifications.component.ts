import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth';
import { NotificationType } from '../../common/enums/notification-type.enum';
import { Router } from '@angular/router';
import { LiveDataListener } from '../../common/models';
import { UserService } from '../../core';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, LiveDataListener {
  public isLoggedInSubscription: Subscription;
  public notificationSubscription: Subscription;
  public notificationsCounterSubscription: Subscription;
  public isLoggedIn: boolean;

  public notifications: any;
  public notificationsCounter = 0;
  public observableSubscription: Subscription;
  public allNotifications: any;
  public isThereChange: boolean;

  constructor(
    private readonly userService: UserService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {
    const isLoggedIn = this.auth.isUserAuthenticated();
    if (isLoggedIn) {
      this.liveDataListener(3000);
    }
  }

  ngOnInit() {
    this.isLoggedInSubscription = this.auth.isLoggedIn$.subscribe(
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        // on user login load the inbox items and display them
        this.notificationSubscription = this.userService.getNotifications().subscribe(
          (data: any) => {
            this.allNotifications = data.notifications;
            this.notifications = data.notifications.filter(x => x.isRead === false).sort((a, b) => {

              // sorting algorithm to show the newest notifications on top
              const x = b.createdOn.toLowerCase();
              const y = a.createdOn.toLowerCase();
              if (x < y) {
                return -1;
              } else {
                return 1;
              }
            });

            this.notificationsCounter = data.notifications.filter(notification => notification.isRead === false).length;
          },
        );
      }
    );
  }

  markNotificationsAsRead(): void {
    this.notificationsCounterSubscription = this.userService.markNotificationsAsRead().subscribe();
    this.notificationsCounter = 0;
  }

  openNotificationType(notification: any): void {
    if (notification.type === NotificationType.Invitation) {
      this.router.navigate([`/user/teams/invitation/${notification.id}`, { notificationId: notification.id, msg: notification.message, }]);
    }
  }

  liveDataListener(time: number): void {
    setInterval(() => {
      this.notificationSubscription =
        this.userService
          .getNotifications()
          .subscribe(
            (data: any) => {
              this.isThereChange = data.notifications.length === this.allNotifications.length;

              if (!this.isThereChange) {
                this.ngOnInit();
              }

              // unsubscribing after the data-check has finished
              // this.notificationSubscription.unsubscribe();
            });
    }, time);
  }
}
