import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TeamService {

    constructor(
        private readonly http: HttpClient,
    ) { }

    createTeam(name: string): Observable<any> {
        return this.http.post('http://localhost:3000/teams', { name });
    }

    getTeamMembers(teamId: string): Observable<any> {
        return this.http.get(`http://localhost:3000/teams/members/${teamId}`);
    }

    getAllTeamsMembers() {
        return this.http.get(`http://localhost:3000/teams/charts/team-members`);
    }

    getUserTeams(): Observable<any> {
        return this.http.get(`http://localhost:3000/users/teams`);
    }

    getAllTeams(): Observable<any> {
        return this.http.get('http://localhost:3000/teams');
    }

    getTeamDetails(teamId: string): Observable<any> {
        return this.http.get(`http://localhost:3000/teams/${teamId}`);
    }

    getAllTeamWorkItems(): Observable<any> {
        return this.http.get(`http://localhost:3000/teams/workItems`);
    }

    inviteMembersToTeam(teamId, members: any) {
        return this.http.post(`http://localhost:3000/teams/invite/${teamId}`, { members, });
    }

    removeMembersFromTeam(teamId: string, members: any): Observable<any> {
        return this.http.post(`http://localhost:3000/teams/remove-members/${teamId}`, { members, });
    }

    getInvitationDetails(invitationId: string): Observable<any> {
        return this.http.get(`http://localhost:3000/teams/invitations/${invitationId}`);
    }

    handleInvitation(value: string, notificationId: string): Observable<any> {
        return this.http.post(`http://localhost:3000/teams/accept/invitation`, {
            notificationId,
            state: value,
        });
    }

    declineInvitation(invitation: any): Observable<any> {
        return;
        // return this.http.put(`http://localhost:3000/teams/invitation/accept/${invitation.id}`, 'decline');
    }
}
