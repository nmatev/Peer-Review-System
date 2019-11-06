import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import {
  AdminComponent,
  AllUsersComponent,
  AllWorkItemsComponent,
  AllTeamsComponent,
  AllTeamReviewsComponent
} from '.';
@NgModule({
  declarations: [
    AdminComponent,
    AllUsersComponent,
    AllWorkItemsComponent,
    AllTeamsComponent,
    AllTeamReviewsComponent
  ],
  imports: [
    SharedModule,
  ]
})
export class AdminModule { }
