import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public registerFormGroup: FormGroup;

  constructor(
    private readonly auth: AuthService,
  ) { }

  ngOnInit() {
    this.registerFormGroup = this.auth.registerFormGroup(this.registerFormGroup);
  }

  public register(name: string, password: string, email: string) {
    this.auth.register(name, password, email);
  }
}
