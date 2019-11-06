import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService, TeamService } from '../core';

@Injectable({
    providedIn: 'root'
})

export class AdminService {

    constructor(
        private readonly http: HttpClient,
        private readonly userService: UserService,
        private readonly teamService: TeamService,
    ) { }

    getAllUsers() {
        return this.userService.getAllUsers();
    }

    getAllWorkItems() {
        return this.http.get(`http://localhost:3000/users/workItems`);
    }

    getAllTeams() {
        return this.teamService.getAllTeams();
    }

    getAllTeamWorkItems() {
        return this.teamService.getAllTeamWorkItems();
    }

    promoteToAdmin(userId: string) {
        return this.http.post(`http://localhost:3000/auth/create-admin/${userId}`, '');
    }

}
