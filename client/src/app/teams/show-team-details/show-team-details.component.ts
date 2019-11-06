import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificatorService, StorageService, UserService, TeamService } from '../../core';

@Component({
  selector: 'app-show-team-details',
  templateUrl: './show-team-details.component.html',
  styleUrls: ['./show-team-details.component.css']
})
export class ShowTeamDetailsComponent implements OnInit, OnDestroy {
  @Input() data: any;
  public selectedMembers = [];
  public searchText;
  public allUsers: any;
  public isAdmin: boolean;
  public team: any;
  public teamMembers: any;
  public selectedMembersForRemove = [];
  public subscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly userService: UserService,
    private readonly teamService: TeamService,
    private readonly storage: StorageService,
    private readonly notificator: NotificatorService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.team = data.team.team;
      this.teamMembers = data.team.teamMembers;
    });

    // filtering current teamMembers not to apear in the table to be invited again
    this.subscription = this.userService.getAllUsers().subscribe(
      (users: any) => {
        this.allUsers = users.filter(incUser => {
          return this.teamMembers.every(currMember => {
            return currMember.id !== incUser.id;
          });
        });
      }
    );

    this.isAdmin = this.storage.get('role').includes('Admin');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  inviteMembers() {
    const teamId = this.team.id;
    this.teamService.inviteMembersToTeam(teamId, this.selectedMembers).subscribe(
      () => {
        this.notificator.success(`The selected members were successfully invited.`);
        this.selectedMembers = [];
      }
    );
  }

  adminRemoveMembers() {
    const teamId = this.team.id;
    this.teamService.removeMembersFromTeam(teamId, this.selectedMembersForRemove).subscribe(
      () => {
        this.selectedMembersForRemove = [];
        this.notificator.success(`Selected members were succesfully removed from ${this.team.name} team!`);
      },
      () => { }
    );
  }

  selectMemberForInvite(member) {
    this.allUsers = this.allUsers.filter(x => x !== member);
    this.selectedMembers.push(member);
  }

  RemoveMemberFromInvite(member) {
    this.selectedMembers = this.selectedMembers.filter(x => x !== member);
    this.allUsers.push(member);
  }

  leaveTeam() {
    const teamId = this.team.id;
    this.userService.leaveTeam(teamId).subscribe(
      () => {
        this.notificator.success(`You have left ${this.team.name} team successfully.`);
        this.router.navigate(['/home']);
      },
      (err) => (err)
    );
  }

  adminSelectMemberForRemoving(member) {
    if (this.isAdmin) {
      this.teamMembers = this.teamMembers.filter(x => x !== member);
      this.selectedMembersForRemove.push(member);
    }
  }

  adminCancelMemberForRemoving(member) {
    this.selectedMembersForRemove = this.selectedMembersForRemove.filter(x => x !== member);
    this.teamMembers.push(member);
  }

  isComponentVisible(array: any) {
    return array.length > 0;
  }
}
