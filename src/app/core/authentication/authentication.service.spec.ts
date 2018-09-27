import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { AuthenticationService, Credentials } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

const credentialsKey = 'ems-credentials-key';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService]
    });
  });

  beforeEach(inject([AuthenticationService], (_authenticationService: AuthenticationService) => {
    authenticationService = _authenticationService;
  }));

  afterEach(() => {
    // Cleanup
    localStorage.removeItem(credentialsKey);
    sessionStorage.removeItem(credentialsKey);
  });

  describe('login', () => {
    it(`should return credentials`, fakeAsync(
      inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
        const request = authenticationService.login({
          username: 'toto',
          password: '123'
        });
        tick();

        request.subscribe(credentials => {
          expect(credentials).toBeDefined();
          expect(credentials.token).toBeDefined();
        });

        backend
          .match({
            url: '/user/auth',
            method: 'POST'
          })[0]
          .flush({ token: '123', username: 'toto' });
      })
    ));

    it('should authenticate user', fakeAsync(
      inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
        expect(authenticationService.isAuthenticated()).toBe(false);

        // Act
        const request = authenticationService.login({
          username: 'toto',
          password: '123'
        });
        tick();

        // Assert
        request.subscribe(() => {
          expect(authenticationService.isAuthenticated()).toBe(true);
          expect(authenticationService.credentials).toBeDefined();
          expect(authenticationService.credentials).not.toBeNull();
          expect((<Credentials>authenticationService.credentials).token).toBeDefined();
          expect((<Credentials>authenticationService.credentials).token).not.toBeNull();
        });

        backend
          .match({
            url: '/user/auth',
            method: 'POST'
          })[0]
          .flush({ token: '123', username: 'toto' });
      })
    ));

    it('should persist credentials for the session', fakeAsync(() => {
      // Act
      const request = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      request.subscribe(() => {
        expect(sessionStorage.getItem(credentialsKey)).not.toBeNull();
      });
    }));

    it('should persist credentials across sessions', fakeAsync(() => {
      // Act
      const request = authenticationService.login({
        username: 'toto',
        password: '123',
        remember: true
      });
      tick();

      // Assert
      request.subscribe(() => {
        expect(localStorage.getItem(credentialsKey)).not.toBeNull();
      });
    }));
  });

  describe('logout', () => {
    it('should clear user authentication', fakeAsync(() => {
      // Arrange
      const loginRequest = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      loginRequest.subscribe(() => {
        expect(authenticationService.isAuthenticated()).toBe(true);

        const request = authenticationService.logout();
        tick();

        request.subscribe(() => {
          expect(authenticationService.isAuthenticated()).toBe(false);
          expect(authenticationService.credentials).toBeNull();
          expect(sessionStorage.getItem(credentialsKey)).toBeNull();
          expect(localStorage.getItem(credentialsKey)).toBeNull();
        });
      });
    }));

    it('should clear persisted user authentication', fakeAsync(() => {
      // Arrange
      const loginRequest = authenticationService.login({
        username: 'toto',
        password: '123',
        remember: true
      });
      tick();

      // Assert
      loginRequest.subscribe(() => {
        expect(authenticationService.isAuthenticated()).toBe(true);

        const request = authenticationService.logout();
        tick();

        request.subscribe(() => {
          expect(authenticationService.isAuthenticated()).toBe(false);
          expect(authenticationService.credentials).toBeNull();
          expect(sessionStorage.getItem(credentialsKey)).toBeNull();
          expect(localStorage.getItem(credentialsKey)).toBeNull();
        });
      });
    }));
  });
});
