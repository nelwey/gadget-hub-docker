import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      authService.isLoggedIn.and.returnValue(true);
    });

    it('should allow access', () => {
      expect(guard.canActivate()).toBeTrue();
    });

    it('should not navigate away', () => {
      guard.canActivate();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      authService.isLoggedIn.and.returnValue(false);
    });

    it('should not allow access', () => {
      expect(guard.canActivate()).toBeFalse();
    });

    it('should redirect to login page', () => {
      guard.canActivate();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
