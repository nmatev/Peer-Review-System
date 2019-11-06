import { Injectable } from '@angular/core';
import { StorageService } from '../core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificatorService } from '../core/services/notificator.service';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/common/helpers/custom-validators';

import { AuthService as SocialLogService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject$ = new BehaviorSubject<boolean>(
    this.isUserAuthenticated()
  );
  private readonly userSubject$ = new BehaviorSubject<string | null>(this.username);

  constructor(
    private readonly storage: StorageService,
    private readonly http: HttpClient,
    private readonly formBuilder: FormBuilder,
    private readonly notificator: NotificatorService,
    private readonly router: Router,
    private readonly socialService: SocialLogService,
  ) { }

  loginFormGroup(formGroup: FormGroup) {
    return formGroup = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
        ]
      ],
    });
  }

  registerFormGroup(formGroup: FormGroup) {
    return formGroup = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(
            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
          ),
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
        ]
      ],
    },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
  }

  private get username(): string | null {
    const token = this.storage.get('token');
    const username = this.storage.get('username') || '';
    if (token) {
      return username;
    }

    return null;
  }

  public isUserAuthenticated(): boolean {
    return !!this.storage.get('token');
  }

  public get user$(): Observable<string> {
    return this.userSubject$.asObservable();
  }

  public get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject$.asObservable();
  }

  public register(name: string, password: string, email: string): Subscription {
    return this.http.post('http://localhost:3000/auth',
      {
        name,
        password,
        email,
      })
      .subscribe(
        (success: any) => {
          this.notificator.success(success.message);
          setTimeout(() => {
            this.login(email, password);
          }, 1500);
        }
        ,
        (err) => this.notificator.error(err.error.message)
      );
  }

  public login(email: string, password: string): Subscription {
    return this.http.post('http://localhost:3000/auth/session', {
      email,
      password,
    })
      .subscribe(
        (data: any) => {
          this.notificator.success(`Welcome back ${data.user.name}`);
          this.storage.set('role', data.role);
          this.storage.set('token', data.token);
          this.storage.set('username', data.user.name.charAt(0).toUpperCase() + data.user.name.slice(1));
          this.storage.set('userId', data.user.id);
          this.isLoggedInSubject$.next(true);


          setTimeout(() => {
            this.router.navigate(['home']);
          }, 150);
        },
        (err) => this.notificator.error(err.error.message)
      );
  }

  public logout(): void {
    this.notificator.success(`Successfull logout, see you later.`);
    this.storage.remove('token');
    this.storage.remove('username');
    this.storage.remove('role');
    this.storage.remove('userId');
    this.isLoggedInSubject$.next(false);

    setTimeout(() => {
      this.router.navigate(['home']);
    }, 500);
  }

  public fbLogin() {
    this.socialService.signIn(FacebookLoginProvider.PROVIDER_ID).then((data) => {
      this.notificator.success(`Welcome back ${data.firstName}`);
      this.storage.set('role', 'fbrole');
      this.storage.set('token', data.authToken);
      this.storage.set('username', data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1));
      this.storage.set('userId', 'fbid');
      this.isLoggedInSubject$.next(true);

    }).catch((err) => console.log(err));
  }
  public googleLogin() {
    this.socialService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data) => {
      this.notificator.success(`Welcome back ${data.firstName}`);
      this.storage.set('role', 'fbrole');
      this.storage.set('token', data.authToken);
      this.storage.set('username', data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1));
      this.storage.set('userId', 'fbid');
      this.isLoggedInSubject$.next(true);

    }).catch((err) => console.log(err));
  }
}
