import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-pending-reviews',
  templateUrl: './user-pending-reviews.component.html',
  styleUrls: ['./user-pending-reviews.component.css']
})
export class UserPendingReviewsComponent implements OnInit, OnDestroy {
  public pendingReviewRequests: any;
  private subscription: Subscription;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.subscription = this.getPendingReviewRequests().subscribe(
      reviewRequests => {
        this.pendingReviewRequests = reviewRequests;
      }
    );
  }

  getPendingReviewRequests() {
    return this.userService.getPendingReviewRequests();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getReviewRequest(workItemId: string) {
    this.router.navigate([`/user/documents/review-requests/${workItemId}`]);
  }
}
