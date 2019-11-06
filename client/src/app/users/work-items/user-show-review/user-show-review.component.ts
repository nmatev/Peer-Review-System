import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, StorageService, NotificatorService, ObservableService } from '../../../core';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-user-show-review',
  templateUrl: './user-show-review.component.html',
  styleUrls: ['./user-show-review.component.css']
})
export class UserShowReviewComponent implements OnInit, OnDestroy {

  public reviewRequest: any;
  public reviewRequestStatus: string = null;

  public workItemComments: any;
  public isAdmin: boolean;
  public isReviewer: boolean;
  public isVoted: boolean;
  public commentState = false;
  public routeSubscribtion: Subscription;
  public userServiceSubscriptionGetComments: Subscription;
  public userServiceSubscriptionVote: Subscription;
  public userServiceSubscriptionCreateComments: Subscription;
  public workItemAttachedFile = null;
  public foundFile = null;

  constructor(
    private route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly storage: StorageService,
    private readonly notificator: NotificatorService,
    private readonly observableService: ObservableService,
  ) { }

  ngOnInit() {
    this.isAdmin = this.storage.get('role').includes('Admin');

    this.routeSubscribtion = this.route.data
      .subscribe(data => {
        this.reviewRequest = data.reviewRequest;
        this.reviewRequestStatus = data.reviewRequest.foundWorkItem.status;
        this.isVoted = data.reviewRequest.isVoted;
        this.isReviewer = this.reviewRequest.reviewers.some(x => x.id === this.storage.get('userId'));
        this.userService.getWorkItemFiles(this.reviewRequest.foundWorkItem.id).subscribe(
          file => {
            this.foundFile = file;
          });
      });

    this.userServiceSubscriptionGetComments = this.userService.getWorkItemComments(this.reviewRequest.foundWorkItem.id)
      .subscribe(
        data => {
          this.workItemComments = data;
          this.workItemComments.sort((a, b) => {

            const x = b.createdOn.toLowerCase();
            const y = a.createdOn.toLowerCase();
            if (x < y) {
              return -1;
            } else {
              return 1;
            }
          });
        });
  }

  createVote(value: string) {
    this.userServiceSubscriptionVote = this.userService.createVote(this.reviewRequest.foundWorkItem.id, value).subscribe(
      (data: any) => {
        this.observableService.refreshComponent(true);
        this.notificator.success(`Your vote was added to the workbase.`);
        this.userServiceSubscriptionVote.unsubscribe();
        this.isVoted = true;
        this.reviewRequest.foundWorkItem.title = data.status;
        this.reviewRequestStatus = data.status;

      },
      (err) => {
        this.notificator.error(err.error.message);
        this.userServiceSubscriptionVote.unsubscribe();

      }
    );
  }

  createComment(description: string) {
    const comment = {
      __author__: {
        name: this.storage.get('username')
      },
      description,
      createdOn: new Date()
    };
    this.workItemComments.unshift(comment);
    this.commentState = !this.commentState;

    this.userServiceSubscriptionCreateComments =
      this.userService.createComment(this.reviewRequest.foundWorkItem.title, description, this.reviewRequest.foundWorkItem.id).subscribe(
        () => {
          this.observableService.refreshComponent(true);
          this.notificator.success(`Your comment was added to workbase.`);
          this.userServiceSubscriptionCreateComments.unsubscribe();
        },
        () => {
          this.userServiceSubscriptionCreateComments.unsubscribe();
        }
      );
  }

  ngOnDestroy() {
    this.userServiceSubscriptionGetComments.unsubscribe();
  }

  openComment() {
    this.commentState = !this.commentState;
  }

  downloadFile() {

    this.userService.downloadFile(this.foundFile.fileName)
      .subscribe(
        data => saveAs(data, this.foundFile.fileName),
        error => console.error(error)
      );
  }

}
