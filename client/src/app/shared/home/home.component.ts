import { Component, NgZone, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService, ChartService } from '../../core';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  public allUsers: any = [];
  public allTeams: any = [];
  public allReviewRequests: any = [];
  public userServiceSubscriptionUsers: Subscription;
  public userServiceSubscriptionTeams: Subscription;
  public userServiceSubscriptionReviews: Subscription;
  public isLoggedInSubscription: Subscription;
  public isLoggedIn = false;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly chartService: ChartService,
    private readonly zone: NgZone) {

  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(
      () => {
        this.chartService.getTeamMembersChartData();
        this.chartService.getTimeDataRegisterdChartData();
        this.chartService.getCountryWorkItemsValues();
      }
    );
  }

  ngOnInit() {
    this.isLoggedInSubscription = this.authService.isLoggedIn$.subscribe(
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        this.userServiceSubscriptionUsers = this.userService.getAllUsers().subscribe(data => this.allUsers = data);
        this.userServiceSubscriptionTeams = this.userService.getAllTeams().subscribe(data => this.allTeams = data);
        this.userServiceSubscriptionReviews = this.userService.getAllReviewRequests().subscribe(data => this.allReviewRequests = data);
      }
    );
  }

  ngOnDestroy() {
    this.isLoggedInSubscription.unsubscribe();
    this.userServiceSubscriptionReviews.unsubscribe();
    this.userServiceSubscriptionTeams.unsubscribe();
    this.userServiceSubscriptionUsers.unsubscribe();
  }

}
