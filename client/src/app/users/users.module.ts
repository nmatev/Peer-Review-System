import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { SharedModule } from '../shared/shared.module';
// import { ShowTeamReviewRequestsComponent } from './work-items/show-team-review-requests/show-team-review-requests.component';
import { UserShowReviewComponent } from './work-items/user-show-review/user-show-review.component';
import { UserCreateReviewComponent } from './work-items/user-create-review/user-create-review.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserStartedReviewsComponent } from './work-items/user-started-reviews/user-started-reviews.component';
// import { ShowTeamReviewsComponent } from '../teams/show-team-reviews/show-team-reviews.component';
import { UserPendingReviewsComponent } from './work-items/user-pending-reviews/user-pending-reviews.component';

@NgModule({
  declarations: [
    UsersComponent,
    UserCreateReviewComponent,
    UserStartedReviewsComponent,
    // ShowTeamReviewsComponent,
    // ShowTeamReviewRequestsComponent,
    UserPendingReviewsComponent,
    UserShowReviewComponent,
    UserProfileComponent
  ],
  exports: [UsersComponent],
  imports: [
    CommonModule, SharedModule
  ]
})
export class UsersModule { }
