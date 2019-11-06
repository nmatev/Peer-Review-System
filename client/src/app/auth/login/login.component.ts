import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormGroup } from '@angular/forms';
import { NotificatorService } from '../../core';
import { AuthService as SocialLogService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

declare var FB: any;
declare global {
  interface Window {
    MouseEvent: typeof MouseEvent;
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginFormGroup: FormGroup;
  public FB: any;
  public user: any;
  public loggedIn: any;
  constructor(
    private readonly auth: AuthService,
    private readonly notificator: NotificatorService,
    private socialService: SocialLogService,
  ) {

  }

  ngOnInit() {
    this.loginFormGroup = this.auth.loginFormGroup(this.loginFormGroup);

    this.socialService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  login(email: string, password: string) {
    this.auth.login(email, password);
  }

  signInWithFB(): void {
    this.auth.fbLogin();
  }

  signInWithGoogle(): void {
    this.auth.googleLogin();
  }
}
