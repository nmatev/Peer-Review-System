import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../../core';

@Component({
  selector: 'app-user-started-reviews',
  templateUrl: './user-started-reviews.component.html',
  styleUrls: ['./user-started-reviews.component.css']
})
export class UserStartedReviewsComponent implements OnInit, OnDestroy {
  private reviewReqSub: Subscription;
  public reviewRequests: any;

  constructor(
    private readonly usersService: UserService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.reviewReqSub = this.usersService.getUserReviewRequests().subscribe(
      (data: any) => this.reviewRequests = data.sort((a, b) => {

        const x = b.status.toLowerCase();
        const y = a.status.toLowerCase();
        if (x > y) {
          return -1;
        } else if (x < y) {
          return 1;
        }
      })
    );
  }

  ngOnDestroy() {
    this.reviewReqSub.unsubscribe();
  }

  openReviewRequest(workItem) {
    this.router.navigate([`/user/documents/review-requests/${workItem.id}`]);
  }
}
