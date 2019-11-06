import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  @Input() data: any;
  @Input() teamReviewRequests = false;
  @Input() addMembers = false;
  @Input() adminAllWorkItems = false;
  @Input() adminAllTeams = false;
  @Input() adminAllTeamWorkItems = false;
  @Input() adminAllMembers = false;

  @Output() selectedMemberEvent = new EventEmitter();
  public searchText;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() { }

  selectMember(selectedMember): void {
    this.selectedMemberEvent.emit(selectedMember);
  }

  openReviewRequest(workItem: any): void {
    this.router.navigate([`/user/documents/review-requests/${workItem.id}`]);
  }

  openTeamDetails(team: any): void {
    this.router.navigate([`user/teams/${team.id}`]);
  }

  listAllUsers(user) {
    this.router.navigate([`user/profile/${user.id}`]);
  }

}
