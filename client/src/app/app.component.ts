import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public isLoggedIn: boolean;
  public isLoggedInSubscription: Subscription;

  constructor(
    private readonly auth: AuthService
  ) { }

  ngOnInit() {
    this.isLoggedInSubscription = this.auth.isLoggedIn$.subscribe(
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      }
    );
  }

  ngOnDestroy() {
    this.isLoggedInSubscription.unsubscribe();
  }
}
