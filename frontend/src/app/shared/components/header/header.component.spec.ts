import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { of, BehaviorSubject } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let cartQuantitySubject: BehaviorSubject<number>;

  // Create a complete router mock
  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl'),
    navigate: jasmine.createSpy('navigate'),
    events: of(new NavigationEnd(1, '/home', '/home')),
    url: '/home',
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'logout',
      'getToken',
      'getUserId',
    ]);

    cartQuantitySubject = new BehaviorSubject<number>(0);
    const mockCartService = {
      currentCartQuantity: cartQuantitySubject,
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, HeaderComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    mockAuthService.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isLoggedIn).toBeFalse();
    expect(component.cartQuantity).toBe(0);
    expect(component.currentRoute).toBe('/home');
  });

  it('should update login status from authService', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    component.ngOnInit();
    expect(component.isLoggedIn).toBeTrue();
  });

  it('should update cart quantity on changes', () => {
    cartQuantitySubject.next(5);
    expect(component.cartQuantity).toBe(5);
  });

  it('should navigate to different routes', () => {
    component.goToLogin();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');

    component.goToHome();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/home');

    component.goToCatalog();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/catalog');

    component.goToCart();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/cart');
  });

  it('should logout and navigate to login', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should update current route on navigation', () => {
    // Create new router instance with different events
    const newRouter = {
      ...mockRouter,
      events: of(new NavigationEnd(1, '/catalog', '/catalog')),
      url: '/catalog',
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CommonModule, HeaderComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: newRouter },
        { provide: CartService, useValue: { currentCartQuantity: cartQuantitySubject } },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(HeaderComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.currentRoute).toBe('/catalog');
  });
});
