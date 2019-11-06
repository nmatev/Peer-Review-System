import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NotificatorService } from '../../core/services/notificator.service';
import { StorageService } from '../../core';
import { AuthService } from '../../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly notificatorService: NotificatorService,
        private readonly storage: StorageService,
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        const isAdmin = (this.storage.get('role') || '' ).includes('Admin');
        const isAuthenticated = this.authService.isUserAuthenticated();

        if (!isAuthenticated || !isAdmin) {
            this.notificatorService.error(`You're unauthorized to access this page!`);
        }

        return isAuthenticated && isAdmin;
    }
}
