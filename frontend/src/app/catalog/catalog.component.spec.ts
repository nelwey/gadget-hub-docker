import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent } from './catalog.component';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Router, NavigationEnd } from '@angular/router';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AuthService } from '../services/auth.service';
import { By } from '@angular/platform-browser';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      price: 5000,
      color: 'red',
      category: 'Smartphones',
      src: 'image1.jpg',
    },
    {
      id: 2,
      title: 'Product 2',
      price: 10000,
      color: 'blue',
      category: 'Headphones',
      src: 'image2.jpg',
    },
  ];

  const mockCartItems = [
    { productId: 1, quantity: 1, price: 5000, title: 'Product 1', src: 'image1.jpg' },
  ];

  beforeEach(async () => {
    // Create mock services with all required properties
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);

    mockCartService = jasmine.createSpyObj(
      'CartService',
      ['getCart', 'addToCart', 'updateProductQuantity', 'isProductInCart'],
      {
        currentCartQuantity: new BehaviorSubject<number>(0), // Required by HeaderComponent
      }
    );

    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);

    // Create a proper Router mock
    const routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
      events: of(new NavigationEnd(1, '/catalog', '/catalog')),
      url: '/catalog',
      getCurrentNavigation: jasmine.createSpy('getCurrentNavigation'),
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        NgxSliderModule,
        HeaderComponent,
        FooterComponent,
        CatalogComponent,
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CartService, useValue: mockCartService },
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    // Setup mock responses
    mockProductService.getProducts.and.returnValue(of(mockProducts));
    mockCartService.getCart.and.returnValue(of(mockCartItems));
    mockCartService.addToCart.and.returnValue(of({}));
    mockCartService.updateProductQuantity.and.returnValue(of({}));
    mockAuthService.isLoggedIn.and.returnValue(false);

    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products and cart on init', () => {
    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(mockCartService.getCart).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.cartProducts.length).toBe(1);
  });

  it('should filter products by color', () => {
    component.selectedColors = ['red'];
    component.filterProducts();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].color).toBe('red');
  });

  it('should filter products by type', () => {
    component.selectedTypes = ['Smartphones'];
    component.filterProducts();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].category).toBe('Smartphones');
  });

  it('should filter products by price range', () => {
    component.minHandleValue = 4000;
    component.maxHandleValue = 6000;
    component.filterProducts();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].price).toBe(5000);
  });

  it('should paginate products correctly', () => {
    component.itemsPerPage = 1;
    component.updatePaginatedProducts();
    expect(component.paginatedProducts.length).toBe(1);

    component.nextPage();
    expect(component.paginatedProducts.length).toBe(1);

    component.prevPage();
    expect(component.paginatedProducts.length).toBe(1);
  });

  it('should add product to cart', () => {
    const product = mockProducts[0];
    component.addToCart(product);
    expect(mockCartService.addToCart).toHaveBeenCalledWith(
      product.id,
      1,
      product.price,
      product.src,
      product.title
    );
  });

  it('should navigate to cart', () => {
    component.goToCart();
    expect(TestBed.inject(Router).navigateByUrl).toHaveBeenCalledWith('/cart');
  });

  it('should update product quantity in cart', () => {
    const product = mockProducts[0];
    component.increaseQuantity(product);
    expect(mockCartService.updateProductQuantity).toHaveBeenCalledWith(
      product.id,
      1,
      'increase',
      product.price
    );

    component.decreaseQuantity(product);
    expect(mockCartService.updateProductQuantity).toHaveBeenCalledWith(
      product.id,
      1,
      'decrease',
      product.price
    );
  });

  it('should check if product is in cart', () => {
    const productInCart = mockProducts[0];
    const productNotInCart = mockProducts[1];

    expect(component.isInCart(productInCart)).toBeTrue();
    expect(component.isInCart(productNotInCart)).toBeFalse();
  });

  it('should handle modal operations', () => {
    const product = mockProducts[0];
    component.openModal(product);
    expect(component.showModal).toBeTrue();
    expect(component.selectedProduct).toEqual(product);

    component.closeModal();
    expect(component.showModal).toBeFalse();
    expect(component.selectedProduct).toBeNull();
  });
  it('should handle error when loading products fails', () => {
    mockProductService.getProducts.and.returnValue(throwError(() => new Error('Failed')));
    component.ngOnInit();
    expect(component.products).toEqual([]);
  });
  it('should handle error when loading cart fails', () => {
    mockCartService.getCart.and.returnValue(throwError(() => new Error('Failed')));
    component.ngOnInit();
    expect(component.cartProducts).toEqual([]);
  });
  it('should handle empty filters', () => {
    component.selectedColors = [];
    component.selectedTypes = [];
    component.minHandleValue = 0;
    component.maxHandleValue = Number.MAX_SAFE_INTEGER;
    component.filterProducts();
    expect(component.filteredProducts.length).toBe(2);
  });
  it('should handle no matching filters', () => {
    component.selectedColors = ['green'];
    component.selectedTypes = ['Laptops'];
    component.minHandleValue = 15000;
    component.filterProducts();
    expect(component.filteredProducts.length).toBe(0);
  });
  it('should not go to previous page when on first page', () => {
    component.currentPage = 1;
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });
  it('should not go to next page when on last page', () => {
    component.itemsPerPage = 2;
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(1);
  });
  it('should not decrease quantity below 1', () => {
    const product = mockProducts[0];
    mockCartService.isProductInCart.and.returnValue(true);
    mockCartService.getCart.and.returnValue(of([{ productId: 1, quantity: 1 }]));

    component.decreaseQuantity(product);
    expect(mockCartService.updateProductQuantity).toHaveBeenCalledWith(
      product.id,
      1,
      'decrease',
      product.price
    );
  });

  it('should reset filters correctly', () => {
    component.selectedColors = ['red'];
    component.selectedTypes = ['Smartphones'];
    component.minHandleValue = 5000;
    component.maxHandleValue = 10000;
    component.resetFilters();
    expect(component.selectedColors).toEqual([]);
    expect(component.selectedTypes).toEqual([]);
    expect(component.minHandleValue).toBe(2990);
    expect(component.maxHandleValue).toBe(167890);
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should correct min value when it exceeds max value', () => {
    component.minHandleValue = 20000;
    component.maxHandleValue = 10000;
    component.onInputChange();
    expect(component.minHandleValue).toBe(10000);
    expect(component.maxHandleValue).toBe(10000);
  });

  it('should correct max value when it falls below min value', () => {
    component.minHandleValue = 10000;
    component.maxHandleValue = 5000;
    component.onInputChange();
    expect(component.minHandleValue).toBe(5000);
    expect(component.maxHandleValue).toBe(5000);
  });
  it('should toggle color selection correctly', () => {
    expect(component.selectedColors).not.toContain('red');
    component.toggleColorSelection('red');
    expect(component.selectedColors).toContain('red');

    component.toggleColorSelection('red');
    expect(component.selectedColors).not.toContain('red');
  });

  it('should toggle type selection correctly', () => {
    expect(component.selectedTypes).not.toContain('Smartphones');
    component.toggleTypeSelection('Smartphones');
    expect(component.selectedTypes).toContain('Smartphones');

    component.toggleTypeSelection('Smartphones');
    expect(component.selectedTypes).not.toContain('Smartphones');
  });
  it('should handle empty product list in pagination', () => {
    component.products = [];
    component.filteredProducts = [];
    component.updatePaginatedProducts();

    expect(component.paginatedProducts.length).toBe(0);
  });

  it('should show previous button only when not on first page', () => {
    component.currentPage = 1;
    component.updatePaginatedProducts();
    expect(component.showPrevButton).toBeFalse();

    component.currentPage = 2;
    component.updatePaginatedProducts();
    expect(component.showPrevButton).toBeTrue();
  });
  it('should add product to cart without selected product if provided', () => {
    const testProduct = mockProducts[0] as Product;
    component.selectedProduct = null;
    component.addToCart(testProduct);
    expect(component.selectedProduct).not.toBeNull();
    expect(component.selectedProduct).toEqual(
      jasmine.objectContaining({
        id: testProduct.id,
      })
    );
    expect(mockCartService.addToCart).toHaveBeenCalled();
  });

  it('should not add to cart when no product is selected or provided', () => {
    component.selectedProduct = null;
    component.addToCart();

    expect(mockCartService.addToCart).not.toHaveBeenCalled();
  });
  it('should initialize with correct default values', () => {
    expect(component.itemsPerPage).toBe(9);
    expect(component.currentPage).toBe(1);
    expect(component.selectedColors).toEqual([]);
    expect(component.selectedTypes).toEqual([]);
    expect(component.minHandleValue).toBe(2990);
    expect(component.maxHandleValue).toBe(167890);
  });

  it('should set filteredProducts to empty array when products loading fails', () => {
    mockProductService.getProducts.and.returnValue(throwError(() => new Error('Failed')));
    component.getProducts();

    expect(component.products).toEqual([]);
    expect(component.filteredProducts).toEqual([]);
  });
});
