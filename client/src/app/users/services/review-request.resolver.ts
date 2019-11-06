import { Injectable } from '@angular/core';
import { NotificatorService } from '../../core/services/notificator.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';

@Injectable({
    providedIn: 'root'
})
export class ReviewRequestResolverService {
    constructor(
        private readonly userService: UserService,
    ) { }

    public resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) {
        const workItemId = route.params['workItemId'];
        return this.userService.getReviewRequest(workItemId);
    }

}
