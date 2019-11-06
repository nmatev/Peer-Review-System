import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private readonly http: HttpClient,
    ) { }

    downloadFile(fileName: string) {
        const body = { fileName: fileName };
        return this.http.post('http://localhost:3000/files/download', body, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
    }

    leaveTeam(teamId) {
        return this.http.delete(`http://localhost:3000/teams/${teamId}`);
    }

    markNotificationsAsRead() {
        return this.http.put('http://localhost:3000/users/notifications', '');
    }

    createReview(title, description, comments, reviewers, teamId) {
        return this.http.post('http://localhost:3000/users/reviews', {
            title, description, comments, reviewers, teamId
        });
    }

    createVote(workItemId: string, voteValue: string) {
        return this.http.put(`http://localhost:3000/users/workItems/${workItemId}/${voteValue}`, '');
    }

    createComment(title: string, description: string, workItemId: string) {
        return this.http.post(`http://localhost:3000/users/${workItemId}`, {
            title,
            description,
        });
    }

    uploadFile(fd, teamId: string, workItemId: string) {
        return this.http.post(`http://localhost:3000/files/upload/${teamId}/${workItemId}`, fd);
    }

    uploadProfilePicture(fd) {
        return this.http.post(`http://localhost:3000/files/picture`, fd);
    }

    getWorkItemFiles(workItemId: string) {
        return this.http.get(`http://localhost:3000/files/file/${workItemId}`);
    }

    getProfiePictrue(userId: string) {
        return this.http.get(`http://localhost:3000/files/picture/${userId}`, { responseType: 'blob' });
    }

    getUserDetails(userId: string) {
        return this.http.get(`http://localhost:3000/users/info/${userId}`);
    }

    getNotifications() {
        return this.http.get('http://localhost:3000/users/inbox');
    }

    getUserReviewRequests() {
        return this.http.get('http://localhost:3000/users/reviews');
    }

    getWorkItemComments(workItemId: string) {
        return this.http.get(`http://localhost:3000/users/${workItemId}/comments`);
    }

    getTeamReviewRequests(teamIds: any) {
        return this.http.post(`http://localhost:3000/teams/reviews/`, {
            teamIds,
        });
    }

    getPendingReviewRequests() {
        return this.http.get(`http://localhost:3000/users/pending-reviews`);
    }

    getTeamMembers(teamId: string) {
        return this.http.get(`http://localhost:3000/teams/${teamId}`);
    }

    getAllTeams() {
        return this.http.get(`http://localhost:3000/teams/`);
    }

    getReviewRequest(workItemId: string) {
        return this.http.get(`http://localhost:3000/users/reviews/${workItemId}`);
    }

    getAllReviewRequests() {
        return this.http.get(`http://localhost:3000/users/all-reviewrequests`);
    }

    getAllUsers() {
        return this.http.get(`http://localhost:3000/users`);
    }

    getUserWorkItemsChartData() {
        return this.http.get(`http://localhost:3000/users/user/workitems`);
    }
}
