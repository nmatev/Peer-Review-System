import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowTeamDetailsResolver } from './teams/services/show-team-details.resolver';
import { ShowInvitationResolver } from './teams/services/show-invitation.resolver';
import { RegisterComponent, LoginComponent } from './auth';
import { RankingsComponent, HomeComponent, NotFoundComponent } from './shared';
import { AuthGuard, AdminGuard } from './common/guards';
import { UsersComponent } from './users/users.component';
import {
  AdminComponent,
  AllUsersComponent,
  AllWorkItemsComponent,
  AllTeamsComponent,
  AllTeamReviewsComponent
} from './admin';
import {
  ShowTeamReviewsComponent,
  TeamsComponent,
  CreateTeamComponent,
  ShowInvitationComponent,
  ShowTeamDetailsComponent
} from './teams';
import {
  UserProfileComponent,
  ProfileResolverService,
  UserCreateReviewComponent,
  UserStartedReviewsComponent,
  UserPendingReviewsComponent,
  UserShowReviewComponent,
  ReviewRequestResolverService
} from './users/work-items';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: 'user/rankings', component: RankingsComponent, canActivate: [AuthGuard] },
  { path: 'user/teams', component: TeamsComponent, canActivate: [AuthGuard] },
  { path: 'user/teams/create-team', component: CreateTeamComponent, canActivate: [AuthGuard] },
  { path: 'user/submit-work', component: UserCreateReviewComponent, canActivate: [AuthGuard] },
  { path: 'user/documents', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'user/documents/review-requests', component: UserStartedReviewsComponent, canActivate: [AuthGuard] },
  { path: 'user/documents/teams', component: ShowTeamReviewsComponent, canActivate: [AuthGuard] },
  { path: 'user/documents/pending-review-requests', component: UserPendingReviewsComponent, canActivate: [AuthGuard] },
  {
    path: 'user/profile/:userId', component: UserProfileComponent,
    resolve: { user: ProfileResolverService }, canActivate: [AuthGuard]
  },
  {
    path: 'user/documents/review-requests/:workItemId', component: UserShowReviewComponent,
    resolve: { reviewRequest: ReviewRequestResolverService }
  },
  {
    path: 'user/teams/invitation/:invitationId', component: ShowInvitationComponent,
    resolve: { invitation: ShowInvitationResolver }, canActivate: [AuthGuard]
  },
  {
    path: 'user/teams/:teamId', component: ShowTeamDetailsComponent, canActivate: [AuthGuard], resolve: {
      team: ShowTeamDetailsResolver,
    }
  },

  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'admin/users', component: AllUsersComponent, canActivate: [AdminGuard] },
  { path: 'admin/work-items', component: AllWorkItemsComponent, canActivate: [AdminGuard] },
  { path: 'admin/teams', component: AllTeamsComponent, canActivate: [AdminGuard] },
  { path: 'admin/team/work-items', component: AllTeamReviewsComponent, canActivate: [AdminGuard] },

  { path: '**', component: NotFoundComponent },

  // after researching for hours an unknown problem started breaking our lazy-routing
  // so we left the app-routing-module to look like this
  // in order to keep the applications alive
  // yet we have sorted them by modules to simplify it as much as possible
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
