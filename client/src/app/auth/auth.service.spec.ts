import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { StorageService } from '../core';
import { of } from 'rxjs';

describe('AuthService', () => {

  const http = jasmine.createSpyObj('HttpClient', ['post']);
  const storage = jasmine.createSpyObj('StorageService', ['get', 'set', 'remove']);

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      ReactiveFormsModule,
      ToastrModule.forRoot(),
      RouterModule.forRoot([]),

    ],
    providers: [
      {
        provide: HttpClient,
        useValue: http,
      },
      {
        provide: StorageService,
        useValue: storage,
      },
    ],
  }));

  it('should be created', () => {
    // Arrange
    const service: AuthService = TestBed.get(AuthService);
    // Act & Assert
    expect(service).toBeTruthy();
  });

  // it('login should log the user in', () => {

  //   http.post.and.returnValue(of({
  //     token: 'token',
  //     user: {
  //       name: 'test',
  //     },
  //   }));

  //   // Arrange
  //   const service: AuthService = TestBed.get(AuthService);
  //   // Act & Assert
  //   service.login('email', 'password').subscribe(
  //     (data) => {
  //       expect(data.user.name).toBe('test');
  //     }
  //   );
  // });

  // it('login should call auth.post', () => {
  //   // Arrange
  //   const service: AuthService = TestBed.get(AuthService);
  //   http.post.calls.reset(); // We call two times 'post', so we need to reset data for next tests
  //   // Act & Assert
  //   service.login('email', 'password').subscribe(
  //     () => expect(http.post).toHaveBeenCalledTimes(1)
  //   );
  // });

});
