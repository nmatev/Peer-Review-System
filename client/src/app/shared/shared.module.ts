import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppRoutingModule } from '../app-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TimeAgoPipe } from 'time-ago-pipe';
import {
  HomeComponent,
  NavbarComponent,
  LeftSidebarComponent,
  SearchBoxComponent,
  NotFoundComponent,
  ChatBoxComponent,
  NotificationsComponent,
  RankingsComponent
} from '.';
@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    LeftSidebarComponent,
    SearchBoxComponent,
    NotFoundComponent,
    ChatBoxComponent,
    NotificationsComponent,
    RankingsComponent,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    AppRoutingModule,
    Ng2SearchPipeModule,
    AngularEditorModule,
  ],
  exports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    AppRoutingModule,
    Ng2SearchPipeModule,
    AngularEditorModule,
    TimeAgoPipe,
    HomeComponent, NavbarComponent, LeftSidebarComponent, SearchBoxComponent, ChatBoxComponent, NotificationsComponent
  ]
})
export class SharedModule {
  constructor(@Optional() @SkipSelf() parent: SharedModule) {
    if (parent) {
      throw new Error('Shared module is already provided!');
    }
  }
}

