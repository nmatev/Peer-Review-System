import { Component, OnInit } from '@angular/core';
import { TeamService, NotificatorService } from '../../core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  createTeamForm: FormGroup;

  constructor(
    private readonly teamService: TeamService,
    private readonly formBuilder: FormBuilder,
    private readonly notificator: NotificatorService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.createTeamForm = this.formBuilder.group({
      teamName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]
      ],
    }
    );
  }

  createTeam(teamName: string) {
    return this.teamService.createTeam(teamName).subscribe(
      (team) => {
        this.notificator.success(`You have succesfully created ${teamName} team!`);
        this.router.navigate([`/user/teams/${team.id}`]);
      },
      (err) => { this.notificator.error(err.message); }
    );
  }

}
