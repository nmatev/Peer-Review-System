import { Injectable } from '@angular/core';
import { NotificatorService } from '../../core/services/notificator.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';

@Injectable({
    providedIn: 'root'
})
export class TeamReviewRequestsResolverService {
    constructor(
        private readonly userService: UserService,
    ) { }

    public resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) {
        const teamId = route.params['teamId'];
        return this.userService.getTeamReviewRequests(teamId)
            .pipe(
                catchError(
                    err => {
                        return of({ reviewRequests: [] });
                    }
                ));
    }

}
