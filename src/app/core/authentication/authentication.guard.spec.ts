import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthenticationService } from '@app/core';
import { MockAuthenticationService } from '@app/core';
import { AuthenticationGuard } from '@app/core';
import { ToastrModule } from 'ngx-toastr';

describe('AuthenticationGuard', () => {
  let authenticationGuard: AuthenticationGuard;
  let authenticationService: MockAuthenticationService;
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
      providers: [
        AuthenticationGuard,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  beforeEach(inject(
    [AuthenticationGuard, AuthenticationService],
    (_authenticationGuard: AuthenticationGuard, _authenticationService: MockAuthenticationService) => {
      authenticationGuard = _authenticationGuard;
      authenticationService = _authenticationService;
    }
  ));

  it('should have a canActivate method', () => {
    expect(typeof authenticationGuard.canActivate).toBe('function');
  });

  it('should return true if user is authenticated', () => {
    expect(authenticationGuard.canActivate()).toBe(true);
  });

  it('should return false and redirect to login if user is not authenticated', () => {
    // Arrange
    authenticationService.credentials = null;

    // Act
    const result = authenticationGuard.canActivate();

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], { replaceUrl: true });
    expect(result).toBe(false);
  });
});
