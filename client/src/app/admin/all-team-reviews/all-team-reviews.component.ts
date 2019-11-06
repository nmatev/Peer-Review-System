import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-team-reviews',
  templateUrl: './all-team-reviews.component.html',
  styleUrls: ['./all-team-reviews.component.css']
})
export class AllTeamReviewsComponent implements OnInit, OnDestroy {

  public teamWorkItems: any;
  public adminServiceSubscription: Subscription;

  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.adminServiceSubscription = this.adminService.getAllTeamWorkItems().subscribe(
      (data: any) => {
        const arr = [];
        data.forEach(el => {
          const teamName = el.name;
          el.__workItems__.forEach(x => {
            const obj = {
              teamName,
              ...x,
            };
            arr.push(obj);
          });
        });

        this.teamWorkItems = arr;
      },
    );
  }

  ngOnDestroy() {
    this.adminServiceSubscription.unsubscribe();
  }

}
