import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService, TeamService } from '../../core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-team-reviews',
  templateUrl: './show-team-reviews.component.html',
  styleUrls: ['./show-team-reviews.component.css']
})
export class ShowTeamReviewsComponent implements OnInit, OnDestroy {

  public usersTeams: any;
  public teamWorkItems: any;
  public workItems: any;
  public teamIds = '';
  public teamServiceSubscription: Subscription;
  public userServiceSubscription: Subscription;

  constructor(
    private readonly userService: UserService,
    private readonly teamService: TeamService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.teamServiceSubscription = this.teamService.getUserTeams().subscribe(teams => {
      this.usersTeams = teams;
      this.teamIds = this.usersTeams.map(team => team.id).join(',');

      this.userServiceSubscription = this.userService.getTeamReviewRequests(this.teamIds)
        .subscribe(data => this.workItems = data);
    });
  }

  ngOnDestroy() {
    this.teamServiceSubscription.unsubscribe();
    this.userServiceSubscription.unsubscribe();
  }

  getTeamReviewRequests(teamId: string) {
    this.router.navigate([`/user/documents/teams/${teamId}/review-requests`]);
  }
}
