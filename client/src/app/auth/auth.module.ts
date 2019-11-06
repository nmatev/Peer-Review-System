import { NgModule } from '@angular/core';
import { LoginComponent, RegisterComponent } from '.';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    RegisterComponent, LoginComponent
  ],
  imports: [
    SharedModule,
  ]
})
export class AuthModule { }
