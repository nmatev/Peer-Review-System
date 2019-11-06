import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TeamService, NotificatorService, ObservableService } from '../../core';

@Component({
  selector: 'app-show-invitation',
  templateUrl: './show-invitation.component.html',
  styleUrls: ['./show-invitation.component.css']
})
export class ShowInvitationComponent implements OnInit, OnDestroy {

  public invitation: any;
  public notificationId: string;
  public message: string;
  public routeSubscription: Subscription;
  public teamServiceSubscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly teamService: TeamService,
    private readonly notificator: NotificatorService,
    private readonly router: Router,
    private readonly observableService: ObservableService,
  ) { }

  ngOnInit() {
    this.routeSubscription = this.route.data.subscribe(data => {
      this.invitation = data.invitation;
    });
    this.notificationId = this.route.snapshot.paramMap.get('notificationId');
    this.message = this.route.snapshot.paramMap.get('msg');

  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  handleInvitation(value: string) {
    const notificationId = this.route.snapshot.paramMap.get('notificationId');

    this.teamServiceSubscription = this.teamService.handleInvitation(value, notificationId).subscribe(
      (data: any) => {
        this.observableService.refreshComponent(true);
        this.router.navigate(['/home']);
        this.notificator.success(data.message);
      },
    );
  }

}
