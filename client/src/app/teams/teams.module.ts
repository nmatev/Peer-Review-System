import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import {
  TeamsComponent,
  CreateTeamComponent,
  ShowTeamDetailsComponent,
  ShowInvitationComponent,
  ShowTeamReviewsComponent
} from '.';
@NgModule({
  declarations: [
    TeamsComponent,
    CreateTeamComponent,
    ShowTeamDetailsComponent,
    ShowInvitationComponent,
    ShowTeamReviewsComponent
  ],
  imports: [
    SharedModule
  ]
})
export class TeamsModule { }
