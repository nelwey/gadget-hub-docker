import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { CartService } from '../services/cart.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: any;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    // Create mock services with all required properties
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'login',
      'logout',
      'isLoggedIn',
      'getToken',
      'getUserId',
    ]);

    mockCartService = jasmine.createSpyObj('CartService', [], {
      currentCartQuantity: new BehaviorSubject<number>(0), // Required by HeaderComponent
    });

    // Create complete router mock with all required properties
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
      events: of(new NavigationEnd(1, '/login', '/login')),
      url: '/login',
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    // Setup mock responses
    mockAuthService.isLoggedIn.and.returnValue(false);
    mockAuthService.getToken.and.returnValue(null);
    mockAuthService.getUserId.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        HeaderComponent, // Standalone component
        FooterComponent, // Standalone component
        LoginComponent, // Standalone component
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form values', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should call authService.login with correct credentials', () => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    component.email = testEmail;
    component.password = testPassword;
    mockAuthService.login.and.returnValue(of({}));

    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith(testEmail, testPassword);
  });

  it('should navigate to catalog on successful login', () => {
    mockAuthService.login.and.returnValue(of({}));

    component.login();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/catalog']);
  });

  it('should set errorMessage on login failure', () => {
    const errorResponse = 'Invalid credentials';
    mockAuthService.login.and.returnValue(throwError(() => errorResponse));

    component.login();

    expect(component.errorMessage).toBe(errorResponse);
  });

  it('should not navigate on login failure', () => {
    mockAuthService.login.and.returnValue(throwError(() => 'Error'));

    component.login();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
