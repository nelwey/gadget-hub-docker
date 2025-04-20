import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockToken = 'mock-jwt-token';
  const mockUserId = 'user-123';
  const mockResponse = {
    token: mockToken,
    userId: mockUserId,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login()', () => {
    it('should make POST request to login endpoint', () => {
      const testEmail = 'test@example.com';
      const testPassword = 'password123';

      service.login(testEmail, testPassword).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service.apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: testEmail,
        password: testPassword,
      });

      req.flush(mockResponse);
    });

    it('should store token and userId in localStorage on successful login', () => {
      service.login('test@example.com', 'password').subscribe(() => {
        expect(localStorage.getItem('token')).toBe(mockToken);
        expect(localStorage.getItem('userId')).toBe(mockUserId);
      });

      const req = httpMock.expectOne(`${service.apiUrl}/login`);
      req.flush(mockResponse);
    });

    it('should not store anything in localStorage if no token in response', () => {
      const responseWithoutToken = { message: 'success' };

      service.login('test@example.com', 'password').subscribe(() => {
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('userId')).toBeNull();
      });

      const req = httpMock.expectOne(`${service.apiUrl}/login`);
      req.flush(responseWithoutToken);
    });
  });

  describe('logout()', () => {
    it('should remove token and userId from localStorage', () => {
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userId', mockUserId);

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userId')).toBeNull();
    });

    it('should not throw if no items in localStorage', () => {
      expect(() => service.logout()).not.toThrow();
    });
  });

  describe('isLoggedIn()', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', mockToken);
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false when no token exists', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('getToken()', () => {
    it('should return token when it exists', () => {
      localStorage.setItem('token', mockToken);
      expect(service.getToken()).toBe(mockToken);
    });

    it('should return null when no token exists', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getUserId()', () => {
    it('should return userId when it exists', () => {
      localStorage.setItem('userId', mockUserId);
      expect(service.getUserId()).toBe(mockUserId);
    });

    it('should return null when no userId exists', () => {
      expect(service.getUserId()).toBeNull();
    });
  });
});
