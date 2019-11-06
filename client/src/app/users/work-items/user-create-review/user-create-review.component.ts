import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  UserService,
  TeamService,
  NotificatorService,
  ObservableService
} from '../../../core';

@Component({
  selector: 'app-user-create-review',
  templateUrl: './user-create-review.component.html',
  styleUrls: ['./user-create-review.component.css']
})
export class UserCreateReviewComponent implements OnInit, OnDestroy {
  public teamMembers = [];
  public reviewers = [];
  public submitForm: FormGroup;
  public selectedTeam: string;
  public allTeams: [];
  public subscription: Subscription;
  public fileToUpload: any = null;

  constructor(
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private readonly teamService: TeamService,
    private readonly notificator: NotificatorService,
    private readonly router: Router,
    private readonly observableService: ObservableService,
  ) { }

  ngOnInit() {
    this.submitForm = this.formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(1000),
        ]
      ],
      comments: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]
      ],
      reviewers: [
        [
          this.formBuilder.array(this.reviewers,
            Validators.min(1))
        ]
      ],
    });

    this.subscription = this.teamService.getAllTeams().subscribe((teams: any) => {
      this.allTeams = teams;
    });
  }

  submitWork() {
    const workfd = this.submitForm.value;

    const foundTeam: any = this.allTeams.find((x: any) => x.name === this.selectedTeam);
    const teamId = foundTeam.id;

    return this.userService.createReview(
      workfd.title, workfd.description, workfd.comments, this.reviewers, teamId)
      .subscribe(
        (workItem: any) => {
          const msg = workItem.__workItem__.title + ' was successfully added to workbase.';
          this.notificator.success(msg);
          this.router.navigate(['/user/documents']);
          this.observableService.refreshComponent(true);

          if (this.fileToUpload) {
            const fd = new FormData();
            fd.append('file', this.fileToUpload);
            return this.userService.uploadFile(fd, teamId, workItem.__workItem__.id).subscribe();
          }
        },
        (err) => {
          this.notificator.error(err.message);
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getTeamMembers(teamName) {
    const foundTeam: any = this.allTeams.find((x: any) => x.name === teamName);
    const teamId = foundTeam.id;

    this.userService.getTeamMembers(teamId).subscribe(
      (members: any) => {
        this.teamMembers = members.teamMembers;
      }
    );
  }

  selectMember(member) {
    this.teamMembers = this.teamMembers.filter(x => x !== member);
    this.reviewers.push(member);
  }

  removeMember(member) {
    this.reviewers = this.reviewers.filter(x => x !== member);
    this.teamMembers.push(member);
  }

  isVisible(arr: any) {
    if (arr.length > 0) {
      return true;
    }
    return false;
  }
}
