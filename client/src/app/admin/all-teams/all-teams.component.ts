import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-teams',
  templateUrl: './all-teams.component.html',
  styleUrls: ['./all-teams.component.css']
})
export class AllTeamsComponent implements OnInit, OnDestroy {
  public teams: any;
  public adminServiceSubscription: Subscription;

  constructor(
    private readonly adminService: AdminService,
  ) { }

  ngOnInit() {
    this.adminServiceSubscription = this.adminService.getAllTeams().subscribe(
      data => {
      this.teams = data;

      },
    );
  }

  ngOnDestroy() {
    this.adminServiceSubscription.unsubscribe();
  }

}
