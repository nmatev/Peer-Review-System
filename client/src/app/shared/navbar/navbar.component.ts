import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth';
import { UserService, StorageService } from '../../core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public isLoggedInSubscription: Subscription;
  public notificationSubscription: Subscription;
  public notificationsCounterSubscription: Subscription;
  public isLoggedIn: boolean;
  public currentUserName: string;

  public notifications: any;
  public notificationsCounter = 0;
  public observableSubscription: Subscription;
  public allNotifications: any;
  public isThereChange: boolean;

  public profilePicture: any = null;

  constructor(
    private readonly auth: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly storage: StorageService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.isLoggedInSubscription = this.auth.isLoggedIn$.subscribe(
        isLoggedIn => {
          this.isLoggedIn = isLoggedIn;
          this.currentUserName = this.storage.get('username');

          const userId = this.storage.get('userId');
          this.userService.getProfiePictrue(userId).subscribe(data => {
            const reader = new FileReader();

            reader.addEventListener('load', () => {
              this.profilePicture = reader.result;
            }, false);

            if (data) {
              reader.readAsDataURL(data);
            }
          });
        }
      );
    }, 500);
  }

  ngOnDestroy() {
    this.notificationSubscription.unsubscribe();
    this.isLoggedInSubscription.unsubscribe();
    this.notificationsCounterSubscription.unsubscribe();
    this.observableSubscription.unsubscribe();
  }
  openProfile() {
    const userId = this.storage.get('userId');
    this.router.navigate([`/user/profile/${userId}`]);
  }
  logout() {
    this.auth.logout();
  }
}
