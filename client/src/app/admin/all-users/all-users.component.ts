import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth';


@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit, OnDestroy {
  public currentPage = 1;
  public itemsPerPage = 5;
  public pageSize: number;
  public adminServiceSubscription: Subscription;
  public isLoggedInSubscription: Subscription;
  public allUsers: any = [];
  constructor(public readonly adminService: AdminService,
    private readonly authService: AuthService, ) { }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  public changePageSize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

  ngOnInit() {
    this.isLoggedInSubscription = this.authService.isLoggedIn$.subscribe(
      isLoggedIn => {
        this.adminServiceSubscription = this.adminService.getAllUsers().subscribe((users: []) => this.allUsers = users);
      }
    );
  }

  ngOnDestroy() {
    this.adminServiceSubscription.unsubscribe();
  }

}
