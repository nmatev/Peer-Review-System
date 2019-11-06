import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NotificatorService } from '../../core/services/notificator.service';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly notificatorService: NotificatorService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const isAuthenticated = this.authService.isUserAuthenticated();

    if (!isAuthenticated) {
      this.notificatorService.error(`You're unauthorized to access this page!`);
    }

    return isAuthenticated;
  }
}
