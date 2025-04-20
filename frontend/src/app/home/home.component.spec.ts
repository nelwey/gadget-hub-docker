import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { SlideComponent } from '../shared/components/slide/slide.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';

interface ProductItem {
  status: string;
  src: string;
  price: number;
  description: string;
  rating: string;
}

describe('HomeComponent', () => {
  let component: HomeComponent & { hitItems: ProductItem[]; newItems: ProductItem[] };
  let fixture: ComponentFixture<HomeComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: any;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', [], {
      currentCartQuantity: new BehaviorSubject<number>(0),
    });

    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);

    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
      events: of(new NavigationEnd(1, '/home', '/home')),
      url: '/home',
      getCurrentNavigation: jasmine.createSpy('getCurrentNavigation'),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, HeaderComponent, FooterComponent, SlideComponent, HomeComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance as HomeComponent & {
      hitItems: ProductItem[];
      newItems: ProductItem[];
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have proper email address', () => {
    expect(component.email).toBe('gadget@hub.ru');
  });

  it('should have hit items with correct structure', () => {
    expect(component.hitItems.length).toBeGreaterThan(0);
    component.hitItems.forEach((item) => {
      expect(item as ProductItem).toEqual(
        jasmine.objectContaining({
          status: jasmine.any(String),
          src: jasmine.any(String),
          price: jasmine.any(Number),
          description: jasmine.any(String),
          rating: jasmine.any(String),
        })
      );
      expect((item as ProductItem).status).toBe('Хит');
    });
  });

  it('should have new items with correct structure', () => {
    expect(component.newItems.length).toBeGreaterThan(0);
    component.newItems.forEach((item) => {
      expect(item as ProductItem).toEqual(
        jasmine.objectContaining({
          status: jasmine.any(String),
          src: jasmine.any(String),
          price: jasmine.any(Number),
          description: jasmine.any(String),
          rating: jasmine.any(String),
        })
      );
      expect((item as ProductItem).status).toBe('Новинка');
    });
  });

  it('should have valid prices in all items', () => {
    const allItems: ProductItem[] = [...component.hitItems, ...component.newItems] as ProductItem[];
    allItems.forEach((item) => {
      expect(item.price).toBeGreaterThan(0);
      expect(item.price).toBeLessThan(100000);
    });
  });
});
