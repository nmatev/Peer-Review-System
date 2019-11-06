import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileResolverService {
    constructor(
        private readonly userService: UserService,
    ) { }

    public resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) {
        const userId = route.params['userId'];
        return this.userService.getUserDetails(userId);
    }

}
