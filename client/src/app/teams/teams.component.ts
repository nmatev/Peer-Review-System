import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TeamService } from '../core';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit, OnDestroy {
  public teamArr: any = {
    teams: [],
    members: [],
  };
  public teamMembers: any;
  public invitationSearch: boolean;
  public teamServiceSubscriptionTeams: Subscription;
  public teamServiceSubscriptionUsers: Subscription;

  constructor(
    private readonly teamService: TeamService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.teamServiceSubscriptionTeams = this.teamService.getUserTeams().subscribe(team => {
      this.teamArr.teams = team;
      this.teamServiceSubscriptionTeams.unsubscribe();

      this.teamServiceSubscriptionUsers =
        team.forEach(x => this.teamService.getTeamMembers(x.id).subscribe(data => {
          if (data.length > 3) {
            this.teamArr.members = data.splice(3);
          }
          this.teamArr.members = data;

        }));
    });
  }

  ngOnDestroy() {
  }

  toggleInvitationSearch() {
    this.invitationSearch = !this.invitationSearch;
  }

  getTeamDetails(teamId: string) {
    this.router.navigate([`/user/teams/${teamId}`]);
  }

  createTeam() {
    this.router.navigate([`/user/teams/create-team`]);
  }
}
