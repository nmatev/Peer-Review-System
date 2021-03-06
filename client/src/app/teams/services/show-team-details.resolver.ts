import { Injectable } from '@angular/core';
import { NotificatorService } from '../../core/services/notificator.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { TeamService } from 'src/app/core/services/team.service';

@Injectable({
    providedIn: 'root'
})
export class ShowTeamDetailsResolver {
    constructor(
        private readonly teamService: TeamService,
    ) { }

    public resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) {
        const teamId = route.params['teamId'];
        return this.teamService.getTeamDetails(teamId)
            .pipe(
                catchError(
                    err => {
                        return of({ team: [] });
                    }
                ));
    }

}
