import { Component, OnInit } from '@angular/core';
import { UserService, StorageService } from '../../core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/admin';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public fileToUpload: any = null;
  public profilePicture: any = null;
  public user: any;
  public userTeams: any;
  public isAdmin: boolean;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly adminServide: AdminService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
      this.isAdmin = data.user.user.roles[0].name.includes('Admin');
      this.userService.getProfiePictrue(this.user.user.id).subscribe(img => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.profilePicture = reader.result;
        }, false);

        if (img) {
          reader.readAsDataURL(img);
        }
      });

    }).unsubscribe();

  }

  uploadPicture() {
    const fd = new FormData();
    fd.append('file', this.fileToUpload);

    this.userService.uploadProfilePicture(fd);
  }

  openTeamDetails(team: any) {
    this.router.navigate([`/user/teams/${team.teamId}`]);
  }

  openWorkItem(workItem: any) {
    this.router.navigate([`/user/documents/review-requests/${workItem.id}`]);
  }

  promoteToAdmin() {
    this.adminServide.promoteToAdmin(this.user.ueser);
  }
}
