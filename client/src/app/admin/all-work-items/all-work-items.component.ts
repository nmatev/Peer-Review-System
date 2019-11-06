import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-all-work-items',
  templateUrl: './all-work-items.component.html',
  styleUrls: ['./all-work-items.component.css']
})
export class AllWorkItemsComponent implements OnInit, OnDestroy {

  public workItems: any;
  public adminServiceSubscription: Subscription;
  public isLoggedInSubscription: Subscription;
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) { }

  ngOnInit() {
    this.isLoggedInSubscription = this.authService.isLoggedIn$.subscribe(
      isLoggedIn => {
        this.adminServiceSubscription = this.adminService.getAllWorkItems().subscribe(data => {
          this.workItems = data;
        });
      }
    );
  }

  ngOnDestroy() {
    this.adminServiceSubscription.unsubscribe();
  }

}
